import React from 'react';
import { AmplifyAuthenticator } from '@aws-amplify/ui-react';
import { AuthState } from '@aws-amplify/ui-components';
import MyAmplifySignUp from '../03_organisms/signUpForm'
import MyAmplifySignIn from '../03_organisms/signInForm'
import { AmplifyForgotPassword} from '@aws-amplify/ui-react';

// // import client id of other IDP
// import appConfig from '../../appConfig'

export interface MyAuthenticatorProps {
    currentAuthState: AuthState.SignIn | AuthState.SignUp | undefined
}

const MyAuthenticator: React.FC<MyAuthenticatorProps> = ({
    currentAuthState,
}) => {
    // const federatedConfig = {
    //     googleClientId: appConfig.aws.cognito.GoogleClientID
    // };
    return (

            <AmplifyAuthenticator initialAuthState={currentAuthState} >
                <AmplifyForgotPassword
                usernameAlias="email"
                slot="forgot-password" />
                <MyAmplifySignIn />
                <MyAmplifySignUp />
            </AmplifyAuthenticator>

    );
}

export default MyAuthenticator