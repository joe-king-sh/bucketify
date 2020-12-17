import React, {
  // ReactNode,
  //  useEffect,
  useState,
  useContext,
} from 'react';

// Styles
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

// 3rd party lib
import InfiniteScroll from 'react-infinite-scroller';

// Template
import PageContainer from '../02_organisms/pageContainer';

// Material-ui components
import CircularProgress from '@material-ui/core/CircularProgress';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import Fab from '@material-ui/core/Fab';
import Zoom from '@material-ui/core/Zoom';

// Icons
import AddIcon from '@material-ui/icons/Add';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import CloseIcon from '@material-ui/icons/Close';
import ShuffleIcon from '@material-ui/icons/Shuffle';

// Service classes
import { fetchAudiosAsync, FetchAudiosInput, FetchAudioOutput } from '../../service/tracksService';

// Contexts
import { UserDataContext, IUserDataStateHooks } from '../../App';

// Make custom styles
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    // Track list table.
    trackListWrapper: {
      height: '550px',
      overflow: 'auto',
    },
    tableCellCheckbox: {
      width: '1%',
      [theme.breakpoints.up('md')]: {
        width: '5%',
      },
    },
    tableCellTitle: {
      width: '39%',
      [theme.breakpoints.up('md')]: {
        width: '35%',
      },
    },
    tableCellArtist: {
      width: '20%',
    },
    tableCellAlbum: {
      width: '25%',
    },
    // tableCellTrack: {
    //   width: '5%',
    // },
    tableCellGenre: {
      width: '15%',
    },

    // Floating aciton button.
    fab: {
      position: 'absolute',
      bottom: theme.spacing(2),
      right: theme.spacing(2),
      [theme.breakpoints.up('md')]: {
        bottom: theme.spacing(6),
        right: theme.spacing(6),
      },
    },
    fabInFab1: {
      position: 'absolute',
      bottom: theme.spacing(10),
      right: theme.spacing(2),
      [theme.breakpoints.up('md')]: {
        bottom: theme.spacing(14),
        right: theme.spacing(6),
      },
    },
    fabInFab2: {
      position: 'absolute',
      bottom: theme.spacing(26),
      right: theme.spacing(2),
      [theme.breakpoints.up('md')]: {
        bottom: theme.spacing(30),
        right: theme.spacing(6),
      },
    },
    fabInFab3: {
      position: 'absolute',
      bottom: theme.spacing(18),
      right: theme.spacing(2),
      [theme.breakpoints.up('md')]: {
        bottom: theme.spacing(22),
        right: theme.spacing(6),
      },
    },
    fabButtonText: {
      padding: '0px 10px 0px 0px',
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
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('md'));
  const UserDataHooks: IUserDataStateHooks = useContext(UserDataContext);

  // TODO move to const.ts
  const limitDisplayTracks = 10;

  /**
   *  States used in this component.
   */
  // NextToken from dynamodb.
  const [nextToken, setNextToken] = useState<string | null | undefined>('');
  // The tracks list to display on this tracks page.
  const [tracks, setTracks] = useState<(TracksDisplayProps | undefined)[]>();
  const [sortSetting, setSortSetting] = useState<{
    needSort: boolean;
    sortKey: 'title' | 'album' | 'artist' | 'genre';
    order: 'asc' | 'desc';
  }>({ needSort: false, sortKey: 'title', order: 'asc' });
  // type sortCondition = {
  //     title: string;
  //     artist: string;
  //     album: string;
  //     genre: string;
  // }
  const handleTracksOrder: () => void = () => {
    if (!tracks || !sortSetting.needSort || !sortSetting.sortKey) {
      return;
    }
    const compareValues = (key: string, order = 'asc') => {
      return (a: TracksDisplayProps, b: TracksDisplayProps) => {
        if (
          (a && Object.prototype.hasOwnProperty.call(a, sortSetting.sortKey)) ||
          (b && Object.prototype.hasOwnProperty.call(b, sortSetting.sortKey))
        ) {
          // !a.hasOwnProperty(sortSetting.sortKey) || !b.hasOwnProperty(sortSetting.sortKey))
          // property doesn't exist on either object
          return 0;
        }

        const varA =
          typeof a[sortSetting.sortKey] === 'string'
            ? a[sortSetting.sortKey].toUpperCase()
            : a[sortSetting.sortKey];
        const varB =
          typeof b[sortSetting.sortKey] === 'string'
            ? b[sortSetting.sortKey].toUpperCase()
            : b[sortSetting.sortKey];

        let comparison = 0;
        if (varA > varB) {
          comparison = 1;
        } else if (varA < varB) {
          comparison = -1;
        }
        return order == 'desc' ? comparison * -1 : comparison;
      };
    };


    tracks.sort(compareValues('title')); 
  };
  // Whether has more track metadata in dynamodb.
  const [hasMoreTracks, setHasMoreTracks] = useState<boolean>(true);
  // Whether is fetching data now.
  const [isFetching, setIsFetching] = useState(false);
  // Controls floationg action button.
  const [isControlActive, setIsControlActive] = useState(false);
  const handleControlActiveToggle = () => {
    setIsControlActive(!isControlActive);
  };
  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  };

  const fetchAudioInput: FetchAudiosInput = {
    username: UserDataHooks.user.username,
    limit: limitDisplayTracks,
    prevNextToken: nextToken,
  };

  /**
   * Fetchs audio metadata in dynamodb
   *
   */
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

  // Table header of tracks
  const trackTableHeader = tracks && (
    <TableContainer component={Paper}>
      <Table
        stickyHeader={true}
        //  className={classes.table}
        aria-label="tracks table"
      >
        <TableHead>
          <TableRow>
            <TableCell className={classes.tableCellCheckbox}>
              <Checkbox inputProps={{ 'aria-label': 'primary checkbox' }} />
            </TableCell>
            <TableCell className={classes.tableCellTitle}>Title</TableCell>
            <TableCell className={classes.tableCellArtist}>Artist</TableCell>
            <TableCell className={classes.tableCellAlbum}>Album</TableCell>
            {/* <TableCell className={classes.tableCellTrack}>Track</TableCell> */}

            {/* Show only pc or tablet */}
            {matches && <TableCell className={classes.tableCellGenre}>Genre</TableCell>}
          </TableRow>
        </TableHead>
      </Table>
    </TableContainer>
  );

  // Table data of tracks
  const trackTable = tracks && (
    <TableContainer component={Paper}>
      <Table stickyHeader={true} aria-label="tracks table">
        <TableBody>
          {tracks.map(
            (track) =>
              track && (
                <TableRow hover role="checkbox" tabIndex={-1} key={track.id}>
                  <TableCell className={classes.tableCellCheckbox}>
                    <Checkbox inputProps={{ 'aria-label': 'primary checkbox' }} />
                  </TableCell>

                  <TableCell component="th" scope="row" className={classes.tableCellTitle}>
                    {track.title}
                  </TableCell>
                  <TableCell className={classes.tableCellArtist}>{track.artist}</TableCell>
                  <TableCell className={classes.tableCellAlbum}>{track.album}</TableCell>
                  {/* <TableCell className={classes.tableCellTrack}>{track.track}</TableCell> */}
                  {matches && (
                    <TableCell className={classes.tableCellGenre}>{track.genre}</TableCell>
                  )}
                </TableRow>
              )
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  // Parameters of loationg action button.
  const fabs = [
    {
      key: 'fab-open',
      in: !isControlActive,
      timeout: transitionDuration,
      style: {
        transitionDelay: `${!isControlActive ? transitionDuration.exit : 0}ms`,
      },
      color: 'secondary',
      className: classes.fab,
      onClick: handleControlActiveToggle,
      icon: <AddIcon />,
      variant: 'round',
    },
    {
      key: 'fab-close',
      in: isControlActive,
      timeout: transitionDuration,
      style: {
        transitionDelay: `${isControlActive ? transitionDuration.exit : 0}ms`,
      },
      color: 'primary',
      className: classes.fab,
      onClick: handleControlActiveToggle,
      icon: <CloseIcon />,
      variant: 'round',
    },
    {
      key: 'fab-play-selected',
      in: isControlActive,
      timeout: transitionDuration,
      style: {
        transitionDelay: `${isControlActive ? transitionDuration.exit + 60 : 0}ms`,
      },
      color: 'secondary',
      className: classes.fabInFab2,
      onClick: handleControlActiveToggle,
      icon: (
        <>
          <span className={classes.fabButtonText}>Play tracks selected</span>
          <PlayArrowIcon />
        </>
      ),
      variant: 'extended',
    },
    {
      key: 'fab-play-random',
      in: isControlActive,
      timeout: transitionDuration,
      style: {
        transitionDelay: `${isControlActive ? transitionDuration.exit + 35 : 0}ms`,
      },
      color: 'secondary',
      className: classes.fabInFab3,
      onClick: handleControlActiveToggle,
      icon: (
        <>
          <span className={classes.fabButtonText}>Play Random</span>
          <ShuffleIcon />
        </>
      ),
      variant: 'extended',
    },
    {
      key: 'fab-add-playlist',
      in: isControlActive,
      timeout: transitionDuration,
      style: {
        transitionDelay: `${isControlActive ? transitionDuration.exit + 10 : 0}ms`,
      },
      color: 'secondary',
      className: classes.fabInFab1,
      onClick: handleControlActiveToggle,
      icon: (
        <>
          <span className={classes.fabButtonText}>Add to Playlist</span>
          <PlaylistAddIcon />
        </>
      ),
      variant: 'extended',
    },
  ];

  return (
    <>
      {/* Fixed header(power is power) */}
      <PageContainer h2Text="Track">
        {/* Table header */}
        {trackTableHeader}
        {/* Table data with infinite scroller */}
        <div className={classes.trackListWrapper}>
          <InfiniteScroll
            pageStart={0}
            loadMore={fetchAudioMetaDataAsync}
            hasMore={!isFetching && hasMoreTracks}
            initialLoad={true}
            loader={<CircularProgress key={0} color="secondary" />}
            useWindow={false}
          >
            {trackTable}
          </InfiniteScroll>
        </div>
      </PageContainer>

      {/* Floating action buttons */}
      {fabs.map((fab) => {
        return (
          <Zoom key={fab.key} in={fab.in} timeout={fab.timeout} style={fab.style} unmountOnExit>
            <Fab
              color={fab.color as 'inherit' | 'primary' | 'secondary' | 'default' | undefined}
              aria-label={fab.key}
              className={fab.className}
              onClick={fab.onClick}
              variant={fab.variant as 'round' | 'extended' | undefined}
            >
              {fab.icon}
            </Fab>
          </Zoom>
        );
      })}
    </>
  );
};

export default Tracks;
