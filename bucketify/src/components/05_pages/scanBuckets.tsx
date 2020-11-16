import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

// Template
import LoginRequiredWrapper from '../04_templates/loginRequiredWrapper';
import GenericTemplate from '../04_templates/genericTemplate';
import PageContainer from '../03_organisms/pageContainer'

import TextField from '@material-ui/core/TextField';
import Box from "@material-ui/core/Box";

import ResponsiveButton from '../01_atoms/responsiveButton'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        scanForm: {
            marginBottom: '2rem',
        },
        button:{
            textAlign: 'center',
        }
    }),
);


const ScanBuckets: React.FC = () => {
    const classes = useStyles();


    return (

        <React.Fragment>

            <GenericTemplate>
                <LoginRequiredWrapper isLoginRequired={true}>

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
                                />

                                <TextField 
                                id="access-key" 
                                label="Access Key" 
                                placeholder='e.g.) AIKCABCDEFABCDEFABCD'
                                helperText="Need to attach the IAM policy that can access to your s3 buckets."
                                fullWidth
                                margin="normal"
                                color="secondary"
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
                                />

                            </Box>

                            <Box className={classes.button}>
                            <ResponsiveButton>
                                Start Scan
                            </ResponsiveButton>
                            </Box>

                        </form>

                    </PageContainer>
                </LoginRequiredWrapper>
            </GenericTemplate>
        </React.Fragment>
    );
}

export default ScanBuckets