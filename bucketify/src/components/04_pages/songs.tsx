import React, {
  // ReactNode,
  //  useEffect,
  useState,
  useContext,
} from 'react';

import InfiniteScroll from 'react-infinite-scroller';

// Template
import PageContainer from '../02_organisms/pageContainer';

// Material-ui components
import CircularProgress from '@material-ui/core/CircularProgress';

// Service classes
import { fetchAudiosAsync, FetchAudiosInput, FetchAudioOutput } from '../../service/songsService';

// Contexts
import { UserDataContext, IUserDataStateHooks } from '../../App';

type SongsListDisplayProps = {
  id: string;
  title: string;
  artist: string;
  album: string;
  genre: string;
  track: number;
};

export const Songs: React.FC = () => {
  const UserDataHooks: IUserDataStateHooks = useContext(UserDataContext);

  const limitDisplaySongs = 10;

  // useEffect(() => {
  //   const fetchAudioMetadata = async () => {
  //     const fetchAudioIdByUserIdAsyncInput: FetchAudiosInput = {
  //       username: UserDataHooks.user.username,
  //       limit: limitDisplaySongs,
  //       prevNextToken: '',
  //     };
  //     const [audioMetaDatas, nextToken] = await fetchAudiosAsync(fetchAudioIdByUserIdAsyncInput);
  //     console.table(nextToken);
  //     console.table(audioMetaDatas);
  //   };
  //   fetchAudioMetadata();
  // }, []);

  /**
   *  States used in this component.
   */
  // Whether the song list has been initial loading.
  const [initSongList, setInitSongsList] = useState<boolean>(false);
  // NextToken from dynamodb.
  const [nextToken, setNextToken] = useState<string>('');
  // The songs list to display on this songs page.
  const [songsLists, setSongsLists] = useState<(SongsListDisplayProps | undefined)[]>();
  const hasMore: () => boolean = () => {
    return nextToken || !initSongList ? true : false;
  };

  const fetchAudioInput: FetchAudiosInput = {
    username: UserDataHooks.user.username,
    limit: limitDisplaySongs,
    prevNextToken: nextToken,
  };

  const fetchAudioMetaData = async () => {
    // Set init flag off
    setInitSongsList(true);

    const fetchAudioOutput: FetchAudioOutput = await fetchAudiosAsync(fetchAudioInput);
    const fetchedSongsList: (
      | SongsListDisplayProps
      | undefined
    )[] = fetchAudioOutput.fetchAudioOutput.map((item) => {
      if (item) {
        return {
          id: item.id,
          title: item.title,
          artist: item.artist,
          album: item.album,
          genre: item.genre,
          track: item.track,
        };
      }
    });

    // Set state
    setSongsLists((prevSongsLists) => {
      console.info('prevSongsLists');
      console.dir(prevSongsLists);
      console.info('fetchedSongsList');
      console.dir(fetchedSongsList);

      let songsList;
      if (prevSongsLists) {
        songsList = prevSongsLists.concat(fetchedSongsList);
      } else {
        songsList = fetchedSongsList;
      }

      return songsList;
    });

    setNextToken(nextToken);
  };

  const items = () => {
    return (
      <>
        {songsLists &&
          songsLists.map((songs, i) => {
            songs && (
              <div key={songs.id}>
                <p>
                  {songs.title} {i}
                </p>
              </div>
            );
          })}
      </>
    );
  };

  return (
    <>
      <PageContainer h2Text="Songs">
        <InfiniteScroll
          pageStart={0}
          loadMore={fetchAudioMetaData}
          hasMore={hasMore()}
          initialLoad={true}
          loader={<CircularProgress></CircularProgress>}
        >
          items...
          {items}
        </InfiniteScroll>

        {items}
      </PageContainer>
    </>
  );
};

export default Songs;
