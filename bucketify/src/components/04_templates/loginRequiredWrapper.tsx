import React, { useContext } from "react";
import Amplify from 'aws-amplify';

import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';
import MyAuthenticator from '../03_organisms/authenticator'

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
    isLoginRequired,
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
            UseDataStateHooks.setUser(authData);
        });
        // eslint-disable-next-line
    }, []);


    if ((AuthStateHooks.authState === AuthState.SignedIn && UseDataStateHooks.user) || !isLoginRequired) {

        console.log('already signed in')

        return (
            <React.Fragment>
                {/* <div>Hello, {UseDataStateHooks.user.username}</div> */}
                {children}
            </React.Fragment>
        );
    }
    else {

        console.log('need to signed in')

        return (
            <MyAuthenticator currentAuthState={AuthState.SignIn} />
        )}
}

export default LoginRequiredWrapper;