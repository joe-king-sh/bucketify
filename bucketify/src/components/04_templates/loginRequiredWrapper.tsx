import React, { useContext } from "react";
import Amplify from 'aws-amplify';
import {
    AmplifyAuthenticator,
    AmplifySignUp,
    AmplifySignIn
} from '@aws-amplify/ui-react';
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';
import Box from "@material-ui/core/Box";

import awsconfig from '../../aws-exports';

import {
    AuthContext,
    UserDataContext
} from '../../App'


Amplify.configure(awsconfig);

export interface LoginRequiredWrapperProps {
    children: React.ReactNode;
    isLoginRequired: boolean;
}

const LoginRequiredWrapper: React.FC<LoginRequiredWrapperProps> = ({
    children,
    isLoginRequired
}) => {

    // Hooks that manage auth states are injectioned from App.
    const AuthStateHooks = useContext(AuthContext);
    const UseDataStateHooks = useContext(UserDataContext);
    React.useEffect(() => {
        return onAuthUIStateChange((nextAuthState, authData) => {
            console.log('Auth check')
            console.log('nextAuthState:' + nextAuthState)
            console.log('authData:' + authData)
            AuthStateHooks.setAuthState(nextAuthState);
            UseDataStateHooks.setUser(authData)
        });
        // eslint-disable-next-line
    }, []);


    if ((AuthStateHooks.authState === AuthState.SignedIn && UseDataStateHooks.user) || !isLoginRequired) {
        return (
            <Box>
                {/* <div>Hello, {UseDataStateHooks.user.username}</div> */}
                {children}
            </Box>
        );
    }
    else {
        return (
            <React.Fragment>
                <AmplifyAuthenticator>
                    <AmplifySignUp
                        slot="sign-up"
                        formFields={[
                            { type: 'email', required: true },
                            { type: 'password', required: true },
                            { type: 'username', required: true },

                        ]}
                        usernameAlias="email" />
                    <AmplifySignIn slot="sign-in" usernameAlias="email" />
                </AmplifyAuthenticator>
            </React.Fragment>);
    }
    // return authState === AuthState.SignedIn && user ? (
    //     <Box>
    //         <div>Hello, {user}</div>
    //         {children}
    //         <AmplifySignOut />
    //     </Box>
    // ) : (
    //         <div>
    //             <p>login requierd</p>
    //             <AmplifyAuthenticator />
    //         </div>

    //     );
}

export default LoginRequiredWrapper;