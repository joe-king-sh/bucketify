import React from 'react';
import { AmplifySignUp } from '@aws-amplify/ui-react';

const MyAmplifySignUp: React.FC = () => {
  return (
    <AmplifySignUp
      slot="sign-up"
      formFields={[
        { type: 'email', required: true },
        { type: 'password', required: true },
        {
          type: 'name',
          label: 'Name *',
          placeholder: 'Enter your name',
          required: true,
        },
      ]}
      usernameAlias="email"
    />
  );
};

export default MyAmplifySignUp;
