import React from 'react';
import { AmplifyAuthenticator } from '@aws-amplify/ui-react';
import { AuthState } from '@aws-amplify/ui-components';
import MyAmplifySignUp from '../03_organisms/signUpForm'
import MyAmplifySignIn from '../03_organisms/signInForm'


export interface MyAuthenticatorProps {
    currentAuthState: AuthState.SignIn | AuthState.SignUp | undefined
}

const MyAuthenticator: React.FC<MyAuthenticatorProps> = ({
    currentAuthState,
}) => {
    return (

            <AmplifyAuthenticator initialAuthState={currentAuthState}>
                <MyAmplifySignIn />
                <MyAmplifySignUp />
            </AmplifyAuthenticator>

    );
}

export default MyAuthenticator