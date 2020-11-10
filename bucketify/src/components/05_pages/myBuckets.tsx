import React from 'react';

// Template
import LoginRequiredWrapper from '../04_templates/loginRequiredWrapper';
import GenericTemplate from '../04_templates/genericTemplate';

import { Container, Typography } from "@material-ui/core";


const MyBuckets: React.FC = () => {
    // const conponents = 
    return (


        // <LoginRequiredWrapper children={conponents} />
        <GenericTemplate>
            <LoginRequiredWrapper isLoginRequired={true}>
                <Container>
                    <Typography variant="h2" component="h2">
                        My Buckets
                    </Typography>
                </Container>
            </LoginRequiredWrapper>
        </GenericTemplate>

    );
}

export default MyBuckets