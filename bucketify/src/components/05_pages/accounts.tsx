import React, { useContext } from 'react';
import {
    UserDataContext,
} from '../../App'

import { Typography } from '@material-ui/core';


// Template
import LoginRequiredWrapper from '../04_templates/loginRequiredWrapper';
import GenericTemplate from '../04_templates/genericTemplate';


const Accounts: React.FC = () => {

    const UserDataHooks = useContext(UserDataContext);

    return (
        <GenericTemplate>
            <LoginRequiredWrapper isLoginRequired={true}>
                {/*TODO 直近はこの方式でいく、userが変わらない券を要確認 
                TODO アカウント情報ページをうまく作る、Dynamodbにアクセスキーw入れるけど、各レコードに入れるかアカウントでもつか要検討*/}
                    {/* {UserDataHooks.user} */}
                <Typography>
                        'aaaaaaaa'
                </Typography>
            </LoginRequiredWrapper>
        </GenericTemplate>
    )
}
export default Accounts