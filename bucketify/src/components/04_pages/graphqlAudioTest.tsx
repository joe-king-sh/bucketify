import React, { useEffect, useState, useContext } from 'react';
// import { AuthState } from '@aws-amplify/ui-components';
import Amplify, { API, graphqlOperation } from 'aws-amplify'
import { listAudioByDataValue } from '../../graphql/queries'
import { ListAudioByDataValueQuery, } from '../../API'
import { GraphQLResult } from '@aws-amplify/api/lib/types';

// import TextField from '@material-ui/core/TextField';
// import Box from "@material-ui/core/Box";

import {
    UserDataContext,
    IUserDataStateHooks,
} from '../../App'

import awsExports from "../../aws-exports";

// Template
// import LoginRequiredWrapper from '../04_templates/loginRequiredWrapper';
// import GenericTemplate from '../04_templates/genericTemplate';

Amplify.configure(awsExports);


type AudioMetaData = {
    id?: string;
    dataType: string;
    dataValue: string | '';
    owner: string ;
}

type AudioMetaDatas = (AudioMetaData)[]


const GraphqlAudioTest: React.FC = () => {

    
    const [audio, setAudios] = useState<AudioMetaDatas>([]);
    
    // fetch data by login user id
    const UserDataHooks: IUserDataStateHooks = useContext(UserDataContext);
    useEffect(() => {
        
        const fetchAudios = async () => {
            try {
                
                let audios: AudioMetaDatas = []
    
                if (UserDataHooks.user === undefined){
                    // When user is not logon yet.
                    console.log('user is not logon yet')
                    return
                }
                const username = UserDataHooks.user.username
                console.log('userid: ' + username)
                const listAudioResult = await API.graphql(graphqlOperation(
                    listAudioByDataValue, { dataValue: username})
                    ) as GraphQLResult
                // 手動抽出でSongsがめんに出す粗糖のJsonを取れるようにしうる。
                const audioList = listAudioResult.data as ListAudioByDataValueQuery
                if (audioList.listAudioByDataValue != null) {
                    if (audioList.listAudioByDataValue.items != null) {
                        console.log(audioList.listAudioByDataValue)
                        audioList.listAudioByDataValue.items.forEach((item) => {
                            if (item != null) {
                                audios.push({
                                    id: item.id,
                                    dataType: item.dataType,
                                    dataValue: item.dataValue.replace(item.owner + '-', ""),
                                    owner: item.owner,
                                })
                            }
                        })
                    }
                }
                setAudios(audios);
    
            } catch (err) { console.log('error fetching audio' , err) }
        }

        console.log('start use effect ')
        fetchAudios()
        console.log('end use effect')
    }, [UserDataHooks])

    return (
        // <GenericTemplate>
            // <LoginRequiredWrapper isLoginRequired={true}>

                <div >
                 
                    {
                        audio.map((audio, index) => (
                            <div key={audio.id ? audio.id : index} >
                                <p >{audio.id}</p>
                                <p >{audio.dataType}</p>
                                <p >{audio.dataValue}</p>
                            </div>
                        ))
                    }
                </div>

            // </LoginRequiredWrapper>
        // </GenericTemplate>
    )
}

export default GraphqlAudioTest