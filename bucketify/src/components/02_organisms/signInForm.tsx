import React from "react";
import { AmplifySignIn} from '@aws-amplify/ui-react';

// import client id of other IDP
// import appConfig from '../../appConfig'


const MyAmplifySignIn: React.FC = () => {
    // const federatedConfig = {
    //     googleClientId: appConfig.aws.cognito.GoogleClientID
    // };
    return (
            // <AmplifySignIn slot='sign-in' usernameAlias='email' federated={federatedConfig} >
            <AmplifySignIn slot='sign-in' usernameAlias='email' >
                {/* Disappear [Sing in with AWS] button.  */}
                {/* <div slot="federated-buttons" /> */}
                
            </AmplifySignIn>
    );
}

export default MyAmplifySignIn
