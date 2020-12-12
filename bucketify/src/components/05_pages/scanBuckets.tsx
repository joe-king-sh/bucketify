import React, { useState, useContext } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

// Template
import PageContainer from '../03_organisms/pageContainer';

// Material-ui components
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Typography } from '@material-ui/core';

// My components
import ResponsiveButton from '../01_atoms/responsiveButton';
import AlertField, { TAlert } from '../03_organisms/alert';
import { LinearProgressWithLabel } from '../01_atoms/linerProgressWithLabel';
import { CustomizedSnackBar } from '../03_organisms/snackBar';

// AWS SDK
import AWS from 'aws-sdk';

// Message
import {
  msgRequiredValueEmpty,
  msgFileNotFound,
  msgProgressSearch,
  msgProgressDelete,
  msgProgressLoading,
  msgProgressFailed,
  msgScaningSucceeded,
} from '../10_utilify/message';

// AWS utilify
import { listObjectKeys, getObjectMetadata } from '../10_utilify/aws_util/s3';

// Graphql
import Amplify, { API, graphqlOperation } from 'aws-amplify';
import { createAudioMetaData, deleteAudioMetaData } from '../../graphql/mutations';
import { listAudioByDataValue } from '../../graphql/queries';
import { GraphQLResult } from '@aws-amplify/api/lib/types';
import { ListAudioByDataValueQuery, DeleteAudioMetaDataInput } from '../../API';

// Utility
import { v4 as uuidv4 } from 'uuid';
import { TAudioMetaData, TAudioMetaDataDynamodb } from '../10_utilify/audioMetaDataParser';

import { UserDataContext, IUserDataStateHooks } from '../../App';

// Typing
import awsExports from '../../aws-exports';

Amplify.configure(awsExports);

/**
 * Style
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    scanForm: {
      marginBottom: '2rem',
    },
    button: {
      textAlign: 'center',
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
      whiteSpace: 'pre-wrap',
      textAlign: 'center',
    },
    progressBarWrapper: {
      width: '90%',
    },
    progresMessage: {
      margin: '1rem 0 1rem 0',
    },
  })
);

/**
 * Return TSX to generate the scan bucket page.
 * The scan bucket page allows below operations to users.
 *  1.Scan user's s3 bucket.
 *  2.Delete old metadata from dynamodb.
 *  3.Expand audio metadata from audio files.
 *  4.Put metadata into dynamodb.
 * @return ScanBucket
 */
const ScanBuckets: React.FC = () => {
  const classes = useStyles();

  const UserDataHooks: IUserDataStateHooks = useContext(UserDataContext);

  /**
   *  States used in this component.
   */
  // Form data
  const [formData, setFormData] = useState({
    bucketName: '',
    accessKey: '',
    secretAccessKey: '',
  });
  // Helper function for input form.
  const setInput = (key: string, value: string) => {
    setFormData({ ...formData, [key]: value });
  };

  // Alert field.

  const [alerts, setAlerts] = useState<TAlert[]>([]);
  const handleAlerts = (alert: TAlert) => {
    setAlerts((prevAlerts) => {
      const alerts = [...prevAlerts, alert];
      return alerts;
    });
  };

  // Validation.
  const initialValidationState = {
    bucketName: { isError: false, description: '' },
    accessKey: { isError: false, description: '' },
    secretAccessKey: { isError: false, description: '' },
  };
  // Helper function for validation.
  const [validation, setValidation] = useState(initialValidationState);
  const handleValidation = (
    isError: boolean,
    message: string,
    inputFormType: 'bucketName' | 'accessKey' | 'secretAccessKey'
  ) => {
    setValidation((prevValidation) => {
      const validation = Object.assign({}, prevValidation);
      validation[inputFormType] = { isError: isError, description: message };
      return validation;
    });
  };

  // Progress Field
  type TProgress = {
    inProgress: boolean;
    nowProcessing: string;
    processedCount: number;
    allCount: number;
  };
  const [progress, setProgress] = useState<TProgress>({
    inProgress: false,
    nowProcessing: '',
    processedCount: 0,
    allCount: 0,
  });

  // Snack Bar
  const [snackBar, setSnackBar] = useState({
    isOpen: false,
  });
  const handleSnackbarClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackBar({ isOpen: false });
  };
  const handleSnackbarOpen = () => {
    setSnackBar({ isOpen: true });
  };

  console.log(setProgress);

  /**
   * Validation check
   *
   * @return {boolean}
   */
  const validationCheck: () => boolean = () => {
    let isValidationError: boolean = false;

    // Confirm bucket name must be not empty.
    if (!formData.bucketName) {
      console.error('The bucket name is empty.');
      const errorDescription = msgRequiredValueEmpty({ requiredValue: 'your bucket name' });
      handleValidation(true, errorDescription, 'bucketName');
      isValidationError = true;
    } else {
      handleValidation(false, '', 'bucketName');
    }
    // Confirm accessKey must be not empty.
    if (!formData.accessKey) {
      console.error('The access key or secret access key is empty.');
      const errorDescription = msgRequiredValueEmpty({ requiredValue: 'your access key' });
      handleValidation(true, errorDescription, 'accessKey');
      isValidationError = true;
    } else {
      handleValidation(false, '', 'accessKey');
    }
    // Confirm SecretAccessKey must be not empty.
    if (!formData.secretAccessKey) {
      console.error('The access key or secret access key is empty.');
      const errorDescription = msgRequiredValueEmpty({ requiredValue: 'your secret access key' });
      handleValidation(true, errorDescription, 'secretAccessKey');
      isValidationError = true;
    } else {
      handleValidation(false, '', 'secretAccessKey');
    }

    return isValidationError;
  };

  /**
   * Scan users buckets and put audio metadatas into dynamodb.
   *
   * @return {*}
   */
  const scanBuckets = async () => {
    try {
      console.group('SCAN_BUCKETS_OPERATION');
      console.info('Start scan your bucket');

      // Validation check
      const isValidationError = validationCheck();
      if (isValidationError) {
        console.error('A validation check error has occurred.');
        return;
      }

      // Set aws credential
      AWS.config.update({
        accessKeyId: formData.accessKey,
        secretAccessKey: formData.secretAccessKey,
      });

      // Init s3 client
      const s3 = new AWS.S3({
        // region: 'ap-northeast-1',
        region: 'us-east-1',
        maxRetries: 5,
      });

      // Init alert field
      setAlerts([]);
      handleSnackbarClose()

      // Call list object operation.
      setProgress({
        inProgress: true,
        nowProcessing: msgProgressSearch({ bucketName: formData.bucketName }),
        processedCount: 0,
        allCount: 0,
      });
      const audioObjectKeys = await listObjectKeys(s3, formData.bucketName, handleAlerts);

      // If no audio file was found, the scan bucket operation will be end immediately.
      if (audioObjectKeys.length === 0) {
        console.warn('No audio file was found.');
        const description = msgFileNotFound();
        const alert: TAlert = {
          severity: 'warning',
          title: 'FileNotFound',
          description: description,
        };
        handleAlerts(alert);
        return;
      }

      // Delete old metadatas.
      setProgress({
        inProgress: true,
        nowProcessing: msgProgressDelete({ bucketName: formData.bucketName }),
        processedCount: 0,
        allCount: 0,
      });
      await deleteAudioMetadata(formData.bucketName);

      // Expand audio metadata and put them into dynamodb.

      const allCount = audioObjectKeys.length;
      for (const [index, audioObjectKey] of audioObjectKeys.entries()) {
        const metadata = await getObjectMetadata(
          s3,
          formData.bucketName,
          audioObjectKey,
          handleAlerts
        );

        // Put metadate in dynamodb.
        await putAudioMetadata(metadata, audioObjectKey);
        setProgress({
          inProgress: true,
          nowProcessing: msgProgressLoading({ audioName: audioObjectKey }),
          processedCount: index + 1,
          allCount: allCount,
        });
      }

      // Show success message in Snackbar.
      handleSnackbarOpen();
    } catch (err) {
      // Show error message in AlertField.
      console.error('An unexpected error has occurred while scanning bucket operation.');
      console.error(err);
      const alert: TAlert = {
        severity: 'error',
        title: 'Error',
        description: msgProgressFailed(),
      };
      handleAlerts(alert);
    } finally {
      setProgress({ inProgress: false, nowProcessing: '', processedCount: 0, allCount: 0 });
    }

    console.groupEnd();
  };

  /**
   *
   * Put metadate in dynamodb operation.
   * @param {TAudioMetaData} metadata
   * @param {string} audioObjectKey
   */
  const putAudioMetadata: (metadata: TAudioMetaData, audioObjectKey: string) => {} = async (
    metadata,
    audioObjectKey
  ) => {
    const audioId = uuidv4();
    const audioMetaDataDynamodb: TAudioMetaDataDynamodb = {
      ...metadata,
      owner: UserDataHooks.user.username,
      accessKey: formData.accessKey,
      secretAccessKey: formData.secretAccessKey,
      s3BucketName: formData.bucketName,
      s3ObjectKey: audioObjectKey,
    };

    type TCreateAudioMetadataInput = {
      id: string;
      dataType: string;
      dataValue: string | number | string[] | null | undefined;
      owner: string;
    };
    for (let [k, v] of Object.entries(audioMetaDataDynamodb)) {
      // Picture is not stored in dynamodb.
      if (k === 'picture') {
        break;
      }

      // DataType of need to attach owner id prefix.
      const searchabledDataType = ['s3BucketName', 'artist', 'album'];
      // Attach ownerid prefix to query owner's datas without scan operation.
      if (searchabledDataType.includes(k)) {
        v = UserDataHooks.user.username + '_' + v;
        console.info('confirm key prefix');
        console.info(k);
      }

      // Set create item input.
      const audioMetaDataDynamodb: TCreateAudioMetadataInput = {
        id: audioId,
        dataType: k,
        dataValue: v,
        owner: UserDataHooks.user.username,
      };

      // Put item operation.
      await API.graphql(graphqlOperation(createAudioMetaData, { input: audioMetaDataDynamodb }));
    }
  };

  /**
   * Delete item by sSBucketName
   *
   * @param {string} s3BucketName
   * @return {Promise()}
   */
  const deleteAudioMetadata: (s3BucketName: string) => {} = async (s3BucketName: string) => {
    console.group('DELETE_EXISTING_DATA');

    // Get audioId by s3BucketName
    const searchCondition = { dataValue: UserDataHooks.user.username + '_' + s3BucketName };
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

  /* ------------ Main TSX ------------ */
  // TSX to return
  return (
    <>
      <PageContainer h2Text="Scan your bucket">
        {/*  Show notification that error or warning or information and more in this alert field. */}
        <AlertField alerts={alerts} />

        {/* Show scanning progress in this field. */}
        <Backdrop className={classes.backdrop} open={progress.inProgress}>
          <Box className={classes.progressBarWrapper}>
            <Box>
              {
                // Show circular progress.
                progress.allCount === 0 && <CircularProgress color="secondary" />
              }
            </Box>
            <Box className={classes.progresMessage}>
              <Typography>{progress.nowProcessing}</Typography>
            </Box>
            <Box>
              {
                // Show progress bar.
                progress.allCount !== 0 && (
                  <LinearProgressWithLabel
                    value={(progress.processedCount / progress.allCount) * 100}
                    processedCount={progress.processedCount}
                    allCount={progress.allCount}
                  />
                )
              }
            </Box>
          </Box>
        </Backdrop>

        {/* Show success notification in this SnackBar. */}
        <CustomizedSnackBar
          alert={{
            severity: 'success',
            title: '',
            description: msgScaningSucceeded(),
          }}
          isSnackBarOpen={snackBar.isOpen}
          handleClose={handleSnackbarClose}
        />

        <form noValidate autoComplete="on">
          <Box className={classes.scanForm}>
            <TextField
              id="s3-buckets-name"
              label="S3 Bucket Name"
              required={true}
              placeholder="e.g.) bucket-for-bucketify"
              fullWidth
              margin="normal"
              color="secondary"
              onChange={(event) => setInput('bucketName', event.target.value)}
              value={formData.bucketName}
              error={validation.bucketName.isError}
              helperText={validation.bucketName.description}
            />
            <p>{validation.bucketName.isError}</p>

            <TextField
              id="access-key"
              label="Access Key"
              required={true}
              placeholder="e.g.) AIKCABCDEFABCDEFABCD"
              fullWidth
              margin="normal"
              color="secondary"
              onChange={(event) => setInput('accessKey', event.target.value)}
              value={formData.accessKey}
              error={validation.accessKey.isError}
              helperText={validation.accessKey.description}
            />

            <TextField
              id="secret-access-key"
              label="Secret Access Key"
              required={true}
              placeholder="e.g.) jAyAipvUbeQV5qqchxWK482wNfjF6c8VuRVRArLQ"
              type="password"
              autoComplete="current-password"
              fullWidth
              margin="normal"
              color="secondary"
              onChange={(event) => setInput('secretAccessKey', event.target.value)}
              value={formData.secretAccessKey}
              error={validation.secretAccessKey.isError}
              helperText={validation.secretAccessKey.description}
            />
          </Box>

          <Box className={classes.button}>
            <ResponsiveButton onClick={scanBuckets}>Start Scan</ResponsiveButton>
          </Box>
        </form>
      </PageContainer>
    </>
  );
};

export default ScanBuckets;
