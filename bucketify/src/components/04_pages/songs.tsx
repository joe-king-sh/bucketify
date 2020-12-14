import React, {
  useEffect,
  // , useState
  useContext,
} from 'react';

// Template
import PageContainer from '../02_organisms/pageContainer';

// Material-ui components

// Service classes
import {
  fetchAudiosAsync,
  FetchAudiosInput,
} from '../../service/songsService';

// Contexts
import { UserDataContext, IUserDataStateHooks } from '../../App';

export const Songs: React.FC = () => {
  const UserDataHooks: IUserDataStateHooks = useContext(UserDataContext);

  const limitDisplaySongs: number = 10;

  useEffect(() => {
    const fetchAudioMetadata = async () => {
      const fetchAudioIdByUserIdAsyncInput: FetchAudiosInput = {
        username: UserDataHooks.user.username,
        limit: limitDisplaySongs,
        // nextToken: '',
      };
      await fetchAudiosAsync(fetchAudioIdByUserIdAsyncInput);
    };
    const audioMetaDatas = fetchAudioMetadata();
    console.table(audioMetaDatas)
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <PageContainer h2Text="Songs">
        <div style={{ height: 400, width: '100%' }}></div>
      </PageContainer>
    </>
  );
};

export default Songs;
