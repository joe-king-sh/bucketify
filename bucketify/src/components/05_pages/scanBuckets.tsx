

import React, { useState, ReactNode } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

// Template
import PageContainer from '../03_organisms/pageContainer'

// Material-ui components
import TextField from '@material-ui/core/TextField';
import Box from "@material-ui/core/Box";
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";

// My components
import ResponsiveButton from '../01_atoms/responsiveButton'

// AWS SDK
import AWS from 'aws-sdk';
import { ListObjectsV2Request, ListObjectsV2Output } from 'aws-sdk/clients/s3';

// Message
import { msgRequiredValueEmpty, msgInValidAccessKey, msgSignatureDoesNotMatch, msgNetworkingError, msgAccessDenied, msgFileNotFound } from '../99_common/message'


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
        alertField: {
            whiteSpace: 'pre-wrap',
        }
    }),

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

    /* ------------ Form input state ------------ */
    // States of input data to access aws environment.
    const [formData, setFormData] = useState({
        bucketName: '',
        accessKey: '',
        secretAccessKey: ''
    });
    // Helper function for input form.
    const setInput = (key: string, value: string) => {
        setFormData({ ...formData, [key]: value })
    }

    /* ------------ Validation check ------------ */
    // States of validation.
    const initialValidationState = {
        validationS3: { isError: false, description: '' },
        validationAccessKey: { isError: false, description: '' },
        validationSecretAccessKey: { isError: false, description: '' },
    }
    const [validation, setValidation] = useState(initialValidationState);
    // Validation
    const validationCheck: () => boolean = () => {

        let isValidationError: boolean = false;

        if (!formData.bucketName) {
            console.error('The bucket name is empty.')
            const errorDescription = msgRequiredValueEmpty({ requiredValue: 'your bucket name' })
            setValidation(prevValidation => {
                let validation = Object.assign({}, prevValidation)
                validation.validationS3 = { isError: true, description: errorDescription }
                return validation
            })
            isValidationError = true
        } else {
            setValidation(prevValidation => {
                let validation = Object.assign({}, prevValidation)
                validation.validationS3 = { isError: false, description: '' }
                return validation
            })
        }
        if (!formData.accessKey) {
            console.error('The access key or secret access key is empty.')
            const errorDescription = msgRequiredValueEmpty({ requiredValue: 'your access key' })
            setValidation(prevValidation => {
                let validation = Object.assign({}, prevValidation)
                validation.validationAccessKey = { isError: true, description: errorDescription }
                return validation
            })
            isValidationError = true
        } else {
            setValidation(prevValidation => {
                let validation = Object.assign({}, prevValidation)
                validation.validationAccessKey = { isError: false, description: '' }
                return validation
            })
        }
        if (!formData.secretAccessKey) {
            console.error('The access key or secret access key is empty.')
            const errorDescription = msgRequiredValueEmpty({ requiredValue: 'your secret access key' })
            setValidation(prevValidation => {
                let validation = Object.assign({}, prevValidation)
                validation.validationSecretAccessKey = { isError: true, description: errorDescription }
                return validation
            })
            isValidationError = true
        } else {
            setValidation(prevValidation => {
                let validation = Object.assign({}, prevValidation)
                validation.validationSecretAccessKey = { isError: false, description: '' }
                return validation
            })
        }

        return isValidationError
    }

    /* ------------ Scan bucket operations ------------ */
    // Scan users buckets and put audio metadatas into dynamodb.
    const scanBuckets = () => {
        console.group('SCAN_BUCKETS_OPERATION')
        console.info('Start scan your bucket')

        // Validation check
        const isValidationError = validationCheck()
        if (isValidationError) {
            console.error('A validation check error has occurred.')
            return
        }

        // Init alert field.
        setAlerts([])
        // Call list object operation.
        const audioObjectKeys = listObjects()
        // If no audio file was found, the scan bucket operation will be end immediately.
        audioObjectKeys.then(keyList => {
            if (keyList.length === 0){
                console.warn('No audio file was found.')
                const description = msgFileNotFound()
                const alert: TAlert = { severity: 'warning', title: 'FileNotFound', description: description }
                setAlerts(prevAlerts => {
                    const alerts = [...prevAlerts, alert]
                    return alerts
                })
                return
            }

            // Delete old metadatas.
            // TODO

            // Expand audio metadata and put them into dynamodb.
            keyList.forEach(key => {
                const audioMetaData = getMetadata(key)
            });

            
        })


        console.groupEnd()
    }

    // List user's object keys in s3 buckets. 
    const listObjects = async () => {
        console.group('CALL_LISTOBJECTS_API')

        // Set aws credential
        AWS.config.update({
            accessKeyId: formData.accessKey,
            secretAccessKey: formData.secretAccessKey
        });

        const s3 = new AWS.S3({
            // region: 'ap-northeast-1',
            region: 'us-east-1',
            maxRetries: 5
        });

        // List objects 
        console.info('Start list objects oparation.')
        let keyList: string[] = [];
        try {
            console.group('CALL_API_TRY_STATEMENT')
            for (let continuationToken = null; ;) {
                console.info('ContinuationToken -> ' + continuationToken)

                const params: ListObjectsV2Request = {
                    Bucket: formData.bucketName
                };
                if (continuationToken) {
                    params.ContinuationToken = continuationToken
                };

                // Call S3 API
                let objects: ListObjectsV2Output = {}
                console.info('Call api start')
                objects = await s3.listObjectsV2(params).promise()
                    .then(data => {
                        return data
                    })
                    .catch(err => {
                        console.error('An error occured when call list objects v2 API.')
                        throw err
                    });
                console.info('Call api end')

                // Filter objects to remain only audio metadata
                if (objects.Contents === undefined) {
                    break;
                }
                objects.Contents.map(v => v.Key).forEach(key => {
                    if (key === undefined) {
                        return;
                    }

                    // Only allowed in below extensions
                    const allowExtentions: Array<string> = ['mp3', 'mp4', 'm4a']
                    const periodPosition: number = key.lastIndexOf('.')
                    if (periodPosition !== -1) {
                        const extension = key.slice(periodPosition + 1).toLowerCase();
                        if (allowExtentions.indexOf(extension) !== -1) {
                            keyList.push(key);
                        }
                    }
                });

                // If the object counts over 1000, isTruncated will be true.
                if (!objects.IsTruncated) {
                    console.info('All objects were listed, so the list buckets operation will be finished.')
                    break;
                }

                // Save the next read position.
                continuationToken = objects.NextContinuationToken;

            }
            console.table(keyList)
            console.groupEnd()

        } catch (err) {
            console.group('CALL_API_CATCH_STATEMENT')
            let alert: TAlert = { severity: 'error', title: '', description: '' }
            if (err.code === 'InvalidAccessKeyId') {
                alert.title = 'Error - InvalidAccessKeyId'
                alert.description = msgInValidAccessKey()
            } else if (err.code === 'SignatureDoesNotMatch') {
                alert.title = 'Error - SignatureDoesNotMatch'
                alert.description = msgSignatureDoesNotMatch()
            } else if (err.code === 'NetworkingError') {
                alert.title = 'Error - NetworkingError'
                alert.description = msgNetworkingError()
            } else if (err.code === 'AccessDenied') {
                alert.title = 'Error - AccessDenied'
                alert.description = msgAccessDenied()
            } else {
                // An unexpected error
                alert.title = 'Error - ' + err.code
                alert.description = err.message
            }

            setAlerts(prevAlerts => {
                const alerts = [...prevAlerts, alert]
                return alerts
            })
            console.error(err.code)
            console.error(err.message)
            console.error(err)
            console.groupEnd()

            throw err
        }

        console.groupEnd()
        return keyList

    }

    // GetItem from dynamodb and expand metadata
    type TAudioMetaData = {
        AudioName: string,
        Artist?: string,
        Album?: string,
    }
    const getMetadata: (key: string) => TAudioMetaData[] = (key: string) => {
        const audioMetaDatas: TAudioMetaData[] = []

        return audioMetaDatas
    } 


    /* ------------ Alert bar ------------ */ 
    // Show alert bar in page top.
    const [alerts, setAlerts] = useState<TAlert[]>([])
    type TAlert = {
        severity: "error" | "warning" | "success" | "info" | undefined;
        description: string;
        title: string;
    }
    type TAlertFieldProps = {
        children?: ReactNode;
        alerts: TAlert[];
    }
    // Alert TSX
    const AlertField: React.FC<TAlertFieldProps> = ({ alerts }) => {
        return (
            <>
                {
                    alerts.map(alert => {
                        return (
                            <Alert severity={alert.severity} className={classes.alertField}>
                                <AlertTitle>{alert.title}</AlertTitle>
                                {alert.description}
                            </Alert>
                        )
                    }
                    )
                }
            </>
        )
    }

    /* ------------ Main TSX ------------ */ 
    // TSX to return
    return (
        <>
            <PageContainer h2Text='Scan your bucket'>

                <AlertField alerts={alerts} />

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
                            onChange={event => setInput('bucketName', event.target.value)}
                            value={formData.bucketName}
                            error={validation.validationS3.isError}
                            helperText={validation.validationS3.description}

                        />
                        <p>{validation.validationS3.isError}</p>

                        <TextField
                            id="access-key"
                            label="Access Key"
                            required={true}
                            placeholder='e.g.) AIKCABCDEFABCDEFABCD'
                            fullWidth
                            margin="normal"
                            color="secondary"
                            onChange={event => setInput('accessKey', event.target.value)}
                            value={formData.accessKey}
                            error={validation.validationAccessKey.isError}
                            helperText={validation.validationAccessKey.description}

                        />

                        <TextField
                            id="secret-access-key"
                            label="Secret Access Key"
                            required={true}
                            placeholder='e.g.) jAyAipvUbeQV5qqchxWK482wNfjF6c8VuRVRArLQ'
                            type="password"
                            autoComplete="current-password"
                            fullWidth
                            margin="normal"
                            color="secondary"
                            onChange={event => setInput('secretAccessKey', event.target.value)}
                            value={formData.secretAccessKey}
                            error={validation.validationSecretAccessKey.isError}
                            helperText={validation.validationSecretAccessKey.description}
                        />

                    </Box>

                    <Box className={classes.button}>
                        <ResponsiveButton onClick={scanBuckets}>
                            Start Scan
                        </ResponsiveButton>
                    </Box>

                </form>

            </PageContainer>
        </>
    );
}

export default ScanBuckets