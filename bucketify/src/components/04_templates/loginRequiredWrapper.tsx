import React, {useContext} from "react";
import Amplify from 'aws-amplify';
import { AmplifyAuthenticator,
     AmplifySignOut
     } from '@aws-amplify/ui-react';
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';
import Box from "@material-ui/core/Box";

import awsconfig from '../../aws-exports';

import {
    AuthContext,
    UserDataContext
  } from '../../App'

export interface LoginRequiredWrapperProps {
    children: React.ReactNode;
}

// export interface User {
//     username: string;
// }

Amplify.configure(awsconfig);

const LoginRequiredWrapper: React.FC<LoginRequiredWrapperProps> = ({
    children,
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
    }, []);


    if (AuthStateHooks.authState === AuthState.SignedIn && UseDataStateHooks.user) {
        return (
            <Box>
                <div>Hello, {UseDataStateHooks.user.username}</div>
                {children}
                <AmplifySignOut />
            </Box>
        );
    }
    else {
        return (
            <div>
               <AmplifyAuthenticator />
            </div>);
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