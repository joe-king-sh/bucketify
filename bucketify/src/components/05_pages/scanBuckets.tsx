

import React, { useState } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

// Template
// import LoginRequiredWrapper from '../04_templates/loginRequiredWrapper';
// import GenericTemplate from '../04_templates/genericTemplate';
import PageContainer from '../03_organisms/pageContainer'

// Material-ui components
import TextField from '@material-ui/core/TextField';
import Box from "@material-ui/core/Box";
// import Alert from "@material-ui/lab/Alert";
// import AlertTitle from "@material-ui/lab/AlertTitle";

// My components
import ResponsiveButton from '../01_atoms/responsiveButton'

// AWS SDK
import AWS from 'aws-sdk';
import { ListObjectsV2Request, ListObjectsV2Output } from 'aws-sdk/clients/s3';


// Message
import { requiredValueEmpty } from '../99_common/message'


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

    const [error, setError] = useState(false);

    const setInput = (key: string, value: string) => {
        setFormData({ ...formData, [key]: value })
    }


    // list user's object metadatas in s3 buckets. 
    const listObjects = async () => {
        console.log('start call listObject api')

        // validation
        if (!formData.bucketName) {
            const errorDescription = requiredValueEmpty({ requiredValue: 'your bucket name' })
            setValidation(prevValidation => {
                let validation = Object.assign({}, prevValidation)
                validation.validationS3 = { isError: true, description: errorDescription }
                return validation
            })
            setError(true)
            return
        } else {
            setValidation(prevValidation => {
                let validation = Object.assign({}, prevValidation)
                validation.validationS3 = { isError: false, description: '' }
                return validation
            })
            setError(false)
        }
        if (!formData.accessKey) {
            const errorDescription = requiredValueEmpty({ requiredValue: 'your access key' })
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
            const errorDescription = requiredValueEmpty({ requiredValue: 'your secret access key' })
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
            region: 'ap-northeast-1',
            maxRetries: 15
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
                try {
                    console.log('befor call api')
                    objects = await s3.listObjectsV2(params).promise()
                        .then(data => {
                            console.log('listObjectsV2Result -> ' + objects)
                            return data
                        })
                        .catch(err => {
                            console.log('An error occured when call list objects v2 API.')
                            console.log(err)
                            throw new Error(err)
                        });
                    console.log('after call api')

                } catch (e) {
                    console.log('aaaa')
                    console.log(e)
                }
                // .catch(err => {
                //     console.log('An error occured when call list objects v2 API.')
                //     console.log(err)
                //     throw new Error(err)
                // });

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
            console.log('catch!!')
            console.log(err)
        }

    }

    // scan users buckets and puitem metadata to dynamodb.
    const scanBuckets = () => {
        console.log('start scan your bucket')
        listObjects()
    }


    return (
        <React.Fragment>

            {/* <GenericTemplate> */}
            {/* <LoginRequiredWrapper isLoginRequired={true}> */}

            <PageContainer h2Text='Scan your bucket'>

                {/* <AlertField alerts={alerts} /> */}

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
                            // error={validation.validationS3.isError}
                            error={error}
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
            {/* </LoginRequiredWrapper> */}
            {/* </GenericTemplate> */}
        </React.Fragment>
    );
}

export default ScanBuckets