import React from "react";
import { AmplifySignIn} from '@aws-amplify/ui-react';

const MyAmplifySignIn: React.FC = () => {
    return (
            <AmplifySignIn slot='sign-in' usernameAlias='email' />
    );
}

export default MyAmplifySignIn
