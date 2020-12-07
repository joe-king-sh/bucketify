

import React, { useState, ReactNode } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

// Template
// import LoginRequiredWrapper from '../04_templates/loginRequiredWrapper';
// import GenericTemplate from '../04_templates/genericTemplate';
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
import { msgRequiredValueEmpty, msgInValidAccessKey, msgSignatureDoesNotMatch, msgNetworkingError } from '../99_common/message'


// Style
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        scanForm: {
            marginBottom: '2rem',
        },
        button: {
            textAlign: 'center',
        }
    }),
);



const ScanBuckets: React.FC = () => {
    const classes = useStyles();

    // states of input data to access aws environment.
    const [formData, setFormData] = useState({
        bucketName: '',
        accessKey: '',
        secretAccessKey: ''
    });

    // states of validation.
    const initialValidationState = {
        validationS3: { isError: false, description: '' },
        validationAccessKey: { isError: false, description: '' },
        validationSecretAccessKey: { isError: false, description: '' },
    }
    const [validation, setValidation] = useState(initialValidationState);

    // helper function for input form.
    const setInput = (key: string, value: string) => {
        setFormData({ ...formData, [key]: value })
    }



    // list user's object metadatas in s3 buckets. 
    const listObjects = async () => {
        console.log('start call listObject api')

        // validation
        if (!formData.bucketName) {
            const errorDescription = msgRequiredValueEmpty({ requiredValue: 'your bucket name' })
            setValidation(prevValidation => {
                let validation = Object.assign({}, prevValidation)
                validation.validationS3 = { isError: true, description: errorDescription }
                return validation
            })
            return
        } else {
            setValidation(prevValidation => {
                let validation = Object.assign({}, prevValidation)
                validation.validationS3 = { isError: false, description: '' }
                return validation
            })
        }
        if (!formData.accessKey) {
            const errorDescription = msgRequiredValueEmpty({ requiredValue: 'your access key' })
            setValidation(prevValidation => {
                let validation = Object.assign({}, prevValidation)
                validation.validationAccessKey = { isError: true, description: errorDescription }
                return validation
            })
            return
        } else {
            setValidation(prevValidation => {
                let validation = Object.assign({}, prevValidation)
                validation.validationAccessKey = { isError: false, description: '' }
                return validation
            })
        }
        if (!formData.secretAccessKey) {
            const errorDescription = msgRequiredValueEmpty({ requiredValue: 'your secret access key' })
            setValidation(prevValidation => {
                let validation = Object.assign({}, prevValidation)
                validation.validationSecretAccessKey = { isError: true, description: errorDescription }
                return validation
            })
            return
        } else {
            setValidation(prevValidation => {
                let validation = Object.assign({}, prevValidation)
                validation.validationSecretAccessKey = { isError: false, description: '' }
                return validation
            })
        }

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

        // list objects 
        console.log('Start list objects oparation.')
        let keyList: string[] = [];
        try {
            for (let continuationToken = null; ;) {
                console.log('continuationToken -> ' + continuationToken)

                const params: ListObjectsV2Request = {
                    Bucket: formData.bucketName
                };
                if (continuationToken) {
                    params.ContinuationToken = continuationToken
                };

                // Call S3 API
                let objects: ListObjectsV2Output = {}
                console.log('befor call api')
                objects = await s3.listObjectsV2(params).promise()
                    .then(data => {
                        console.log('listObjectsV2Result -> ' + objects)
                        return data
                    })
                    .catch(err => {
                        console.log('An error occured when call list objects v2 API.')
                        throw err
                    });
                console.log('after call api')

                // Add object keys of audio files
                if (objects.Contents === undefined) {
                    break;
                }
                objects.Contents.map(v => v.Key).forEach(v => {
                    if (v === undefined) {
                        return;
                    }
                    keyList.push(v);
                });

                // If the object counts over 1000, isTruncated will be true.
                if (!objects.IsTruncated) {
                    break;
                }

                // Save the next read position.
                continuationToken = objects.NextContinuationToken;

            }
            console.log('keyList ->' + keyList)

        } catch (err) {
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
            } else {
                // An expected error
                alert.title = 'Error - ' + err.code
                alert.description = err.message
            }

            setAlerts(prevAlerts => {
                const alerts = [...prevAlerts, alert]
                return alerts
            })
            console.log(err.code)
            console.log(err.message)
            console.log(err)
        }

    }

    // Scan users buckets and puitem metadata to dynamodb.
    const scanBuckets = () => {
        console.log('start scan your bucket')

        // init alert field.
        setAlerts([])

        // call list object oparation.
        listObjects()
    }

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
    const AlertField: React.FC<TAlertFieldProps> = ({ alerts }) => {
        return (
            <>
                {
                    alerts.map(alert => {
                        return (
                            <Alert severity={alert.severity}>
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