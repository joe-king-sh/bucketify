import React from 'react';
import { Container, Typography } from '@material-ui/core';

// template
// import GenericTemplate from '../04_templates/genericTemplate';
// import LoginRequiredWrapper from '../04_templates/loginRequiredWrapper';

const NotFound: React.FC = () => (
  <React.Fragment>
    {/* <GenericTemplate> */}
    {/* <LoginRequiredWrapper isLoginRequired={false}> */}

    <Container>
      <Typography variant="h2" component="h2">
        Not Found
      </Typography>
      <Typography>
        Sorry..
        <br />
        This page has been deleted or not exists.
      </Typography>
    </Container>

    {/* </LoginRequiredWrapper> */}
    {/* </GenericTemplate> */}
  </React.Fragment>
);

export default NotFound;
