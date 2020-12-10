// import { fromUrl } from 'id3js';
import * as musicMetadata from 'music-metadata-browser';
import { getExtension } from './utility';

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
type TAudioMetaDataWithoutPicture = Omit<TAudioMetaData, 'picture'>

// Type of metadata in dynamodb table
export type TAudioMetaDataDynamodb = TAudioMetaDataWithoutPicture & {
  owner: string;
  accessKey: string;
  secretAccessKey: string;
  s3BucketName: string;
  s3ObjectKey: string;
}

/**
 * Get audio metadata from an audio file by s3 pre-signed URL.
 *
 * @param {string} signedUrl
 * @param {string} key key of a s3 object.
 * @return {TAudioMetaData}
 */
export const getMetadataBySignedUrl: (
  signedUrl: string,
  key: string
) => Promise<TAudioMetaData> = async (signedUrl, key) => {
  console.group('GET_AUDIO_METADATA');

  let audioMetaData: TAudioMetaData = {
    title: key,
  };

  const extension = getExtension(key);

  console.log('extension: ' + extension);

  const metadata = await getMP3Metadata(signedUrl, key);
  if (metadata !== null) {
      audioMetaData = metadata;
  }
  console.groupEnd();
  return audioMetaData;
};

/**
 * Get audio metadata that their extension is MP3.
 *
 * @param {*} signedUrl
 * @param {*} key
 * @return {*}
 */
export const getMP3Metadata: (
  signedUrl: string,
  key: string
) => Promise<TAudioMetaData | null> | null = async (signedUrl, key) => {
  let audioMetaData: TAudioMetaData | null = {title: key};

  const metadata: musicMetadata.IAudioMetadata = await musicMetadata.fetchFromUrl(signedUrl);
  console.dir(metadata);
  if (metadata === null) {
    return null;
  } else {
    if (metadata.common.title) audioMetaData.title = metadata.common.title ;
    if (metadata.common.album) audioMetaData.album = metadata.common.album ;
    if (metadata.common.artist) audioMetaData.artist = metadata.common.artist ;
    if (metadata.common.albumartist) audioMetaData.artist = metadata.common.albumartist ;
    if (metadata.common.track.no) audioMetaData.track = metadata.common.track.no ;
    // if (metadata.common.picture) audioMetaData.picture = metadata.common.picture ;
    if (metadata.common.genre) audioMetaData.genre = metadata.common.genre ;
  }

  return audioMetaData;
};
