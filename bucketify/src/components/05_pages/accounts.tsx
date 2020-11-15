import React, { useContext } from 'react';
import {
    UserDataContext,
    IUserDataStateHooks,
} from '../../App'

import { Typography, Container } from '@material-ui/core';


// Template
import LoginRequiredWrapper from '../04_templates/loginRequiredWrapper';
import GenericTemplate from '../04_templates/genericTemplate';


const Accounts: React.FC = () => {

    const UserDataHooks: IUserDataStateHooks = useContext(UserDataContext);

    // React.useEffect(() => {
    //     console.log('user in user effect :'+ UserDataHooks.user )
    //     });
    // }, [UserDataHooks]);

    return (
        <GenericTemplate>
            <LoginRequiredWrapper isLoginRequired={true}>
                <Container>
                    {/*TODO 直近はこの方式でいく、userが変わらない券を要確認 
                TODO アカウント情報ページをうまく作る、Dynamodbにアクセスキーw入れるけど、各レコードに入れるかアカウントでもつか要検討
                必要な情報を洗い出す。Accountsはいらないかもだけど、基本のアクセスキーとIDを設定するか迷う。Accountページは、正直いらないかもしれない。
                画面遷移と簡単あ画面のイメージをdrawoioで定義して、それに合わせてDynamodbの設計を始める。

                パスワード変更画面作って、ここから遷移できるようにする。パスワード変更自体はAuthenticator使う

                パスワード変更とかいる？いらなくね？

                後、普通にログインした場合の確認コードからの認証がうまくいかない。
                

                */}

                    {console.log('usr data: ' + UserDataHooks.user)}
                    {UserDataHooks.user !== undefined &&

                        
                        <Typography>
                            {UserDataHooks.user.username}<br />
                            {UserDataHooks.user.attributes.email}<br />
                            {UserDataHooks.user.attributes.name}<br />
                            {console.log('fetchUserData:' +UserDataHooks.user.fetchUserData())}<br />

                        </Typography>
                    }
                </Container>
            </LoginRequiredWrapper>
        </GenericTemplate>
    )
}
export default Accounts