// 3rd party libs
import * as musicMetadata from 'music-metadata-browser';

// AWS SDK
import { ListObjectsV2Request, ListObjectsV2Output, GetObjectRequest } from 'aws-sdk/clients/s3';

// My components
import { TAlert } from '../components/02_organisms/alert';

// Utilify
import { isAllowedAudioFormat, getExtension } from '../common/utility';
import { v4 as uuidv4 } from 'uuid';
import { searchabledDataType } from '../common/const';

// Graphql
import Amplify, { API, graphqlOperation } from 'aws-amplify';
import { createAudioMetaData, deleteAudioMetaData } from '../graphql/mutations';
import { listAudioByDataValue } from '../graphql/queries';
import { GraphQLResult } from '@aws-amplify/api/lib/types';
import { ListAudioByDataValueQuery, DeleteAudioMetaDataInput } from '../API';

// Translation
// import TFunction from 'react-i18next';

// common
// import { AppName } from '../common/const';

import awsExports from '../aws-exports';

// Amplify Init
Amplify.configure(awsExports);

// Type of metadata in audio file
export type TAudioMetaData = {
  title: string;
  album?: string | null;
  artist?: string | null;
  track?: number | null;
  picture?: musicMetadata.IPicture[] | null;
  genre?: string[] | null;
};

// Type of metadata in audio file without album cover art.
type TAudioMetaDataWithoutPicture = Omit<TAudioMetaData, 'picture'>;

// Type of metadata in dynamodb table
export type TAudioMetaDataDynamodb = TAudioMetaDataWithoutPicture & {
  owner: string;
  accessKey: string;
  secretAccessKey: string;
  s3BucketName: string;
  s3ObjectKey: string;
};

/**
 * Extracts audio metadata from an audio file by s3 pre-signed URL.
 *
 * @param {string} signedUrl
 * @param {string} key key of a s3 object.
 * @return {TAudioMetaData}
 */
export const extractMetadataBySignedUrlAsync: (
  signedUrl: string,
  key: string
) => Promise<TAudioMetaData> = async (signedUrl, key) => {
  console.group('GET_AUDIO_METADATA');

  const audioMetaData: TAudioMetaData = {
    title: key,
  };

  const extension = getExtension(key);

  console.log('extension: ' + extension);

  const metadata: musicMetadata.IAudioMetadata = await musicMetadata.fetchFromUrl(signedUrl);
  console.dir(metadata);
  if (metadata === null) {
    return audioMetaData;
  } else {
    if (metadata.common.title) audioMetaData.title = metadata.common.title;
    if (metadata.common.album) audioMetaData.album = metadata.common.album;
    if (metadata.common.artist) audioMetaData.artist = metadata.common.artist;
    if (metadata.common.albumartist) audioMetaData.artist = metadata.common.albumartist;
    if (metadata.common.track.no) audioMetaData.track = metadata.common.track.no;
    // if (metadata.common.picture) audioMetaData.picture = metadata.common.picture ;
    if (metadata.common.genre) audioMetaData.genre = metadata.common.genre;
  }

  console.groupEnd();
  return audioMetaData;
};

/**
 * Get pre-signed url from s3 and extract metadata from audio files.
 *
 * @param {AWS.S3} s3
 * @param {string} bucketName
 * @param {string} key
 * @return Promise<TAudioMetaData>
 */
export const getObjectMetadataAsync: (
  s3: AWS.S3,
  bucketName: string,
  key: string,
  handleAlerts: (alert: TAlert) => void
) => Promise<TAudioMetaData> = async (
  s3,
  bucketName,
  key,
  handleAlerts: (alert: TAlert) => void
) => {
  console.group('CALL_GET_OBJECT_API');
  let audioMetaData: TAudioMetaData | null = null;
  try {
    const params: GetObjectRequest = {
      Bucket: bucketName,
      Key: key,
    };
    console.info('Call api start');

    const s3SignedUrl = await s3.getSignedUrl('getObject', params);
    console.info(s3SignedUrl);
    audioMetaData = await extractMetadataBySignedUrlAsync(s3SignedUrl, key);

    console.info('Call api end');
  } catch (err) {
    console.group('CALL_API_CATCH_STATEMENT');
    const alert: TAlert = { severity: 'error', title: '', description: '' };
    alert.title = 'Error - ' + err.code;
    alert.description = err.message;

    handleAlerts(alert);
    console.error(err.code);
    console.error(err.message);
    console.error(err);
    console.groupEnd();

    throw err;
  }

  console.groupEnd();
  return audioMetaData;
};

/**
 * Calls list object s3 API to scan objects in the user's s3 buckets.
 * and filters them to be only audio files.
 *
 * @param {AWS.S3} s3
 * @param {string} bucketName
 * @param {(alert: TAlert) => void} handleAlerts
 * @param {t} translation helper
 * @return Promise<string[]> An array of s3 object keys of user's audio files.
 */
export const listAudioFilesKeysInS3Async: (
  s3: AWS.S3,
  bucketName: string,
  handleAlerts: (alert: TAlert) => void,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: any
) => Promise<string[]> = async (s3, bucketName, handleAlerts, t) => {
  console.group('CALL_LIST_OBJECTS_API');

  // List objects
  console.info('Start list objects oparation.');
  const keyList: string[] = [];
  try {
    console.group('CALL_API_TRY_STATEMENT');
    for (let continuationToken = null; ; ) {
      console.info('ContinuationToken -> ' + continuationToken);

      const params: ListObjectsV2Request = {
        Bucket: bucketName,
      };
      if (continuationToken) {
        params.ContinuationToken = continuationToken;
      }

      // Call S3 API
      let objects: ListObjectsV2Output = {};
      console.info('Call api start');
      objects = await s3
        .listObjectsV2(params)
        .promise()
        .then((data) => {
          return data;
        })
        .catch((err) => {
          console.error('An error occured when call list objects v2 API.');
          throw err;
        });
      console.info('Call api end');

      // Filter objects to remain only audio metadata
      if (objects.Contents === undefined) {
        break;
      }
      objects.Contents.map((v) => v.Key).forEach((key) => {
        if (key === undefined) {
          return;
        }

        if (isAllowedAudioFormat(key)) {
          keyList.push(key);
        }
      });

      // If the object counts over 1000, isTruncated will be true.
      if (!objects.IsTruncated) {
        console.info('All objects were listed, so the list buckets operation will be finished.');
        break;
      }

      // Save the next read position.
      continuationToken = objects.NextContinuationToken;
    }
    console.table(keyList);
    console.groupEnd();
  } catch (err) {
    console.group('CALL_API_CATCH_STATEMENT');
    const alert: TAlert = { severity: 'error', title: '', description: '' };
    if (err.code === 'InvalidAccessKeyId') {
      alert.title = 'Error - InvalidAccessKeyId';
      alert.description = t('Error message InvalidAccessKey');
    } else if (err.code === 'SignatureDoesNotMatch') {
      alert.title = 'Error - SignatureDoesNotMatch';
      alert.description = t('Error message SignatureDoesNotMatch');
    } else if (err.code === 'NetworkingError') {
      alert.title = 'Error - NetworkingError';
      alert.description = t('Error message NetworkError');
    } else if (err.code === 'AccessDenied') {
      alert.title = 'Error - AccessDenied';
      alert.description = t('Error message AccessDenied');
    } else {
      // An unexpected error
      alert.title = 'Error - ' + err.code;
      alert.description = err.message;
    }

    handleAlerts(alert);
    console.error(err.code);
    console.error(err.message);
    console.error(err);
    console.groupEnd();

    throw err;
  }

  console.groupEnd();
  return keyList;
};

/**
 *
 * Put metadate in dynamodb operation.
 * @param {TAudioMetaData} metadata
 * @param {string} audioObjectKey
 */
export const putAudioMetadataAsync: (
  metadata: TAudioMetaData,
  audioObjectKey: string,
  username: string,
  accessKey: string,
  secretAccessKey: string,
  bucketName: string
) => void = async (metadata, audioObjectKey, username, accessKey, secretAccessKey, bucketName) => {
  const audioId = uuidv4();
  const audioMetaDataDynamodb: TAudioMetaDataDynamodb = {
    ...metadata,
    owner: username,
    accessKey: accessKey,
    secretAccessKey: secretAccessKey,
    s3BucketName: bucketName,
    s3ObjectKey: audioObjectKey,
  };

  type TCreateAudioMetadataInput = {
    id: string;
    dataType: string;
    dataValue: string | number | string[] | null | undefined;
    owner: string;
  };
  for (const [k, v] of Object.entries(audioMetaDataDynamodb)) {
    // Picture is not stored in dynamodb.
    if (k === 'picture') {
      break;
    }

    // Attach ownerid prefix to query owner's datas without scan operation.
    let registerValue: string | number | string[] | null | undefined = '';
    if (searchabledDataType.includes(k)) {
      registerValue = username + '_' + v;
      console.info('confirm key prefix');
      console.info(k);
    } else {
      registerValue = v;
    }

    // Set create item input.
    const audioMetaDataDynamodb: TCreateAudioMetadataInput = {
      id: audioId,
      dataType: k,
      dataValue: registerValue,
      owner: username,
    };

    // Put item operation.
    await API.graphql(graphqlOperation(createAudioMetaData, { input: audioMetaDataDynamodb }));
  }
};

/**
 * Delete item by sSBucketName
 *
 * @param {string} s3BucketName
 * @param {string} username
 */
export const deleteAudioMetadataAsync: (s3BucketName: string, username: string) => void = async (
  s3BucketName: string,
  username: string
) => {
  console.group('DELETE_EXISTING_DATA');

  // Get audioId by s3BucketName
  const searchCondition = { dataValue: username + '_' + s3BucketName };
  const listAudioResult = (await API.graphql(
    graphqlOperation(listAudioByDataValue, searchCondition)
  )) as GraphQLResult;
  const audioResult = listAudioResult.data as ListAudioByDataValueQuery;

  // Type guard
  if (
    audioResult === null ||
    audioResult.listAudioByDataValue === null ||
    audioResult.listAudioByDataValue.items === null
  ) {
    console.info('Delete audio metadata is nothing to do.');
    return;
  }

  // Make unique id set
  const audioIdSet = new Set<string>();
  audioResult.listAudioByDataValue.items.forEach((item) => {
    if (item) {
      audioIdSet.add(item.id);
    }
  });

  // Delete item by s3BucketName
  for (const id of audioIdSet) {
    console.info('Delete audio id: ' + id);

    // Value is not used.
    const dataTypes: TAudioMetaDataDynamodb = {
      title: '',
      album: '',
      artist: '',
      track: 0,
      genre: [''],
      owner: '',
      accessKey: '',
      secretAccessKey: '',
      s3BucketName: '',
      s3ObjectKey: '',
    };
    for (const dataType of Object.keys(dataTypes)) {
      // It must be specified both the partition key and the sort key when delete combined key table in Dynamodb.
      const deleteInput: DeleteAudioMetaDataInput = {
        id: id,
        dataType: dataType,
      };
      const deleteResult = await API.graphql(
        graphqlOperation(deleteAudioMetaData, { input: deleteInput })
      );
      console.dir(deleteResult);
    }
  }
  console.groupEnd();
};
