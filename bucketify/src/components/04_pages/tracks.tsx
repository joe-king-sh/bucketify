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
import { fetchAudiosAsync, FetchAudiosInput, FetchAudioOutput } from '../../service/tracksService';

// Contexts
import { UserDataContext, IUserDataStateHooks } from '../../App';

type TracksDisplayProps = {
  id: string;
  title: string;
  artist: string;
  album: string;
  genre: string;
  track: number;
};

export const Tracks: React.FC = () => {
  const UserDataHooks: IUserDataStateHooks = useContext(UserDataContext);

  const limitDisplayTracks = 5;

  /**
   *  States used in this component.
   */
  // NextToken from dynamodb.
  const [nextToken, setNextToken] = useState<string | null | undefined>('');
  // The tracks list to display on this tracks page.
  const [tracks, setTrackss] = useState<(TracksDisplayProps | undefined)[]>();
  // Whether has more track metadata in dynamodb.
  const [hasMoreTracks, setHasMoreTracks] = useState<boolean>(true);

  const fetchAudioInput: FetchAudiosInput = {
    username: UserDataHooks.user.username,
    limit: limitDisplayTracks,
    prevNextToken: nextToken,
  };

  const fetchAudioMetaData = async () => {
    // Fetch audio metadata from dynamodb
    const fetchAudioOutput: FetchAudioOutput = await fetchAudiosAsync(fetchAudioInput);
    const fetchedTracks: (TracksDisplayProps | undefined)[] = fetchAudioOutput.fetchAudioOutput.map(
      (item) => {
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
      }
    );

    // Set tracks state for displayed.
    setTrackss((prevTrackss) => {
      console.info('prevTrackss');
      console.dir(prevTrackss);
      console.info('fetchedTracks');
      console.dir(fetchedTracks);

      let tracksList;
      if (prevTrackss) {
        tracksList = prevTrackss.concat(fetchedTracks);
      } else {
        tracksList = fetchedTracks;
      }

      return tracksList;
    });

    // Set next token.
    setNextToken(fetchAudioOutput.nextToken);
    if (!fetchAudioOutput.nextToken) {
      setHasMoreTracks(false);
    }
  };

  const items: JSX.Element[] = [];
  if (tracks) {
    console.info('tracks:');
    console.table(tracks);
    tracks.map((track, i) => {
      if (track) {
        items.push(
          <div key={track.id}>
            <p key={track.id}>
              {track.id} {track.title} {i}
            </p>
          </div>
        );
      }
    });
  }

  return (
    <>
      <PageContainer h2Text="Tracks">
        <InfiniteScroll
          pageStart={0}
          loadMore={fetchAudioMetaData}
          hasMore={hasMoreTracks}
          initialLoad={true}
          loader={<CircularProgress key={0}></CircularProgress>}
          useWindow={true}
        >
          items...
          {items}
        </InfiniteScroll>

        {items}
      </PageContainer>
    </>
  );
};

export default Tracks;
