import React, {
  // ReactNode,
  //  useEffect,
  useState,
  useContext,
} from 'react';

// Styles
import { makeStyles, createStyles } from '@material-ui/core/styles';

// 3rd party lib
import InfiniteScroll from 'react-infinite-scroller';

// Template
import PageContainer from '../02_organisms/pageContainer';

// Material-ui components
// import CircularProgress from '@material-ui/core/CircularProgress';

// Service classes
import { fetchAudiosAsync, FetchAudiosInput, FetchAudioOutput } from '../../service/tracksService';

// Contexts
import { UserDataContext, IUserDataStateHooks } from '../../App';

// Make custom styles
const useStyles = makeStyles(() =>
  createStyles({
    trackListWrapper: {
      height: '700px',
      overflow: 'auto',
    },
  })
);

// init current page
// let page = 0;

type TracksDisplayProps = {
  id: string;
  title: string;
  artist: string;
  album: string;
  genre: string;
  track: number;
};

export const Tracks: React.FC = () => {
  const classes = useStyles();
  const UserDataHooks: IUserDataStateHooks = useContext(UserDataContext);

  // TODO move to const.ts
  const limitDisplayTracks = 5;

  /**
   *  States used in this component.
   */
  // NextToken from dynamodb.
  const [nextToken, setNextToken] = useState<string | null | undefined>('');
  // The tracks list to display on this tracks page.
  const [tracks, setTracks] = useState<(TracksDisplayProps | undefined)[]>();
  // Whether has more track metadata in dynamodb.
  const [hasMoreTracks, setHasMoreTracks] = useState<boolean>(true);
  // Whether is fetching data now.
  const [isFetching, setIsFetching] = useState(false);

  const fetchAudioInput: FetchAudiosInput = {
    username: UserDataHooks.user.username,
    limit: limitDisplayTracks,
    prevNextToken: nextToken,
  };

  const fetchAudioMetaDataAsync = async () => {
    try {
      setIsFetching(true);

      // Fetch audio metadata from dynamodb
      const fetchAudioOutput: FetchAudioOutput = await fetchAudiosAsync(fetchAudioInput);
      const fetchedTracks: (
        | TracksDisplayProps
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

      // Set tracks state for displayed.
      console.info('prevTracks');
      console.table(tracks);
      console.info('fetchedTracks');
      console.table(fetchedTracks);
      if (tracks) {
        setTracks([...tracks, ...fetchedTracks]);
      } else {
        setTracks([...fetchedTracks]);
      }
      // setTracks([...tracks, ...fetchedTracks]);
      console.info('nowTracks');
      console.table(tracks);

      // Set hasMoreTracks
      if (!fetchAudioOutput.nextToken) {
        setHasMoreTracks(false);
      }

      // Set nextToken.
      console.info('nextToken: ' + fetchAudioOutput.nextToken);
      setNextToken(fetchAudioOutput.nextToken);
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setIsFetching(false);
    }
  };

  // const items: JSX.Element[] = [];
  // if (tracks) {
  //   console.info('tracks:');
  //   console.table(tracks);
  //   tracks.map((track, i) => {
  //     if (track) {
  //       items.push(
  //         <div key={track.id}>
  //           <p key={track.id}>
  //             {track.id} {track.title} {i}
  //           </p>
  //         </div>
  //       );
  //     }
  //   });
  // }

  const trackTable = tracks && (
    <ul key={0}>
      {tracks.map(
        (track, i) =>
          track && (
            <li key={i}>
              {track.id} {track.title} {i}
            </li>
          )
      )}
    </ul>
  );

  return (
    <>
      <PageContainer h2Text="Tracks">
        <div className={classes.trackListWrapper}>
          <InfiniteScroll
            pageStart={0}
            loadMore={fetchAudioMetaDataAsync}
            hasMore={!isFetching && hasMoreTracks}
            initialLoad={true}
            loader={
              // <CircularProgress key={0}></CircularProgress>
              <div key={0}>Loading ...</div>
            }
            useWindow={false}
          >
            items...
            {trackTable}
          </InfiniteScroll>
        </div>
      </PageContainer>
    </>
  );
};

export default Tracks;
