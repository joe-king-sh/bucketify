import React from 'react';
import { AuthState } from '@aws-amplify/ui-components';

// Template
import GenericTemplate from '../04_templates/genericTemplate';

// Authorization components
import MyAuthenticator from '../03_organisms/authenticator'


const SignIn: React.FC = () => {
    return (

        //TODO Stateを見てSinin済みだったらAccountsにリダイレクトする処理を入れる

        <GenericTemplate>
            <MyAuthenticator currentAuthState={AuthState.SignIn} />
        </GenericTemplate>

    );
}

export default SignIn