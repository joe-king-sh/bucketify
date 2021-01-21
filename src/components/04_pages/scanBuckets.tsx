import React, { useState, useContext } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

// Template
import PageContainer from '../02_organisms/pageContainer';

// Material-ui components
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Typography } from '@material-ui/core';

// My components
import ResponsiveButton from '../01_atoms_and_molecules/responsiveButton';
import AlertField, { TAlert } from '../02_organisms/alert';
import { LinearProgressWithLabel } from '../01_atoms_and_molecules/linerProgressWithLabel';
import { CustomizedSnackBar } from '../02_organisms/snackBar';

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
} from '../../common/message';

// Service classes
import {
  getObjectMetadataAsync,
  listAudioFilesKeysInS3Async,
  deleteAudioMetadataAsync,
  putAudioMetadataAsync,
} from '../../service/scanBucketService';

// Contexts
import { UserDataContext, IUserDataStateHooks } from '../../App';

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
 * @return TSX of ScanBucket
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
    let isValidationError = false;

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
      handleSnackbarClose();

      // Call list object operation.
      setProgress({
        inProgress: true,
        nowProcessing: msgProgressSearch({ bucketName: formData.bucketName }),
        processedCount: 0,
        allCount: 0,
      });
      const audioObjectKeys = await listAudioFilesKeysInS3Async(
        s3,
        formData.bucketName,
        handleAlerts
      );

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
      await deleteAudioMetadataAsync(formData.bucketName, UserDataHooks.user.username);

      // Expand audio metadata and put them into dynamodb.
      const allCount = audioObjectKeys.length;
      for (const [index, audioObjectKey] of audioObjectKeys.entries()) {
        const metadata = await getObjectMetadataAsync(
          s3,
          formData.bucketName,
          audioObjectKey,
          handleAlerts
        );

        // Put metadate in dynamodb.
        await putAudioMetadataAsync(
          metadata,
          audioObjectKey,
          UserDataHooks.user.username,
          formData.accessKey,
          formData.secretAccessKey,
          formData.bucketName
        );
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
