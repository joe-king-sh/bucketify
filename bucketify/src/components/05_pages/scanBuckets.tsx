import React, { useState } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

// Template
import PageContainer from '../03_organisms/pageContainer'

// Material-ui components
import TextField from '@material-ui/core/TextField';
import Box from "@material-ui/core/Box";

// My components
import ResponsiveButton from '../01_atoms/responsiveButton'
import AlertField, {TAlert} from '../03_organisms/alert'
// AWS SDK
import AWS from 'aws-sdk';

// Message
import { 
    msgRequiredValueEmpty,
    msgFileNotFound 
} from '../10_utilify/message'

// AWS utilify
import {listObjectKeys, getObjectMetadata} from '../10_utilify/aws_util/s3'
import {TAudioMetaData} from '../10_utilify/audioMetaDataParser'




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

        // Init alert field.
        setAlerts([])
        // Call list object operation.
        const audioObjectKeys = listObjectKeys(s3, formData.bucketName, setAlerts)
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
                getObjectMetadata(s3, formData.bucketName, key, setAlerts).then((metadata: TAudioMetaData) =>{
                    console.info('key: ' + key)
                    console.info('metadata: ')
                    console.dir(metadata)
    
                })
            });
            
        })

        console.groupEnd()
    }


    /* ------------ Alert bar ------------ */ 
    // Show alert bar in page top.
    const [alerts, setAlerts] = useState<TAlert[]>([])


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