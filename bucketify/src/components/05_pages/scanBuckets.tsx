

import React, {useState} from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

// Template
// import LoginRequiredWrapper from '../04_templates/loginRequiredWrapper';
// import GenericTemplate from '../04_templates/genericTemplate';
import PageContainer from '../03_organisms/pageContainer'

// Material-ui components
import TextField from '@material-ui/core/TextField';
import Box from "@material-ui/core/Box";

// My components
import ResponsiveButton from '../01_atoms/responsiveButton'

// AWS SDK
import AWS from 'aws-sdk';

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

    // state of input data to access aws environment.
    const [clientSecrets, setClientSecrets] = useState({
        bucketName: '',
        accessKey: '',
        secretAccessKey: ''
    });

    const setInput = (key: string, value: string) => {
        setClientSecrets({ ...clientSecrets, [key]: value })
    }

    // list user's object metadatas in s3 buckets. 
    const listObjects = () => {

        if (clientSecrets.accessKey !== '' && clientSecrets.secretAccessKey !== ''){
            console.log(clientSecrets.accessKey, clientSecrets.secretAccessKey)
            AWS.config.update({
                accessKeyId: clientSecrets.accessKey,
                secretAccessKey: clientSecrets.secretAccessKey
            });

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

                        <form noValidate autoComplete="on">

                            <Box className={classes.scanForm}>
                                <TextField
                                    id="s3-buckets-name"
                                    label="S3 Bucket Name"
                                    placeholder="e.g.) bucket-for-bucketify"
                                    fullWidth
                                    margin="normal"
                                    color="secondary"
                                    onChange={event => setInput('bucketName', event.target.value)}
                                    value={clientSecrets.bucketName}

                                />

                                <TextField
                                    id="access-key"
                                    label="Access Key"
                                    placeholder='e.g.) AIKCABCDEFABCDEFABCD'
                                    helperText="Need to attach the IAM policy that can access to your s3 buckets."
                                    fullWidth
                                    margin="normal"
                                    color="secondary"
                                    onChange={event => setInput('accessKey', event.target.value)}
                                    value={clientSecrets.accessKey}
                                />

                                <TextField
                                    id="secret-access-key"
                                    label="Secret Access Key"
                                    placeholder='e.g.) jAyAipvUbeQV5qqchxWK482wNfjF6c8VuRVRArLQ'
                                    type="password"
                                    autoComplete="current-password"
                                    fullWidth
                                    margin="normal"
                                    color="secondary"
                                    onChange={event => setInput('secretAccessKey', event.target.value)}
                                    value={clientSecrets.secretAccessKey}

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