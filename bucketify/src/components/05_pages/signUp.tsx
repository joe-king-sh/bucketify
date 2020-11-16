import React, { useContext, useEffect } from 'react';
import { AuthState } from '@aws-amplify/ui-components';

// Template
import GenericTemplate from '../04_templates/genericTemplate';

// Authorization components
import MyAuthenticator from '../03_organisms/authenticator'

// Router
import { useHistory } from "react-router-dom";

import { AuthContext } from '../../App'
  

const SignUp: React.FC = () => {

    const AuthStateHooks = useContext(AuthContext);
    const history = useHistory();
    
    useEffect(() => {
        console.log('Check whether the user has already signed in or not.')

        // If ther user already signed in, push history /accounts.
        if (AuthStateHooks.authState === AuthState.SignedIn){
            console.log('you have already signd in. push history to accounts')
            history.push('/accounts')
        }
      }, [history, AuthStateHooks.authState]);
    
    return (

        <GenericTemplate>
            <MyAuthenticator currentAuthState={AuthState.SignUp} />
            
        </GenericTemplate>
    );
}

export default SignUp