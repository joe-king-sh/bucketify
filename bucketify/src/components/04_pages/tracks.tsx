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

// MyComponents
import AlertField, { TAlert } from '../02_organisms/alert';

// Icons
import AddIcon from '@material-ui/icons/Add';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import CloseIcon from '@material-ui/icons/Close';
// import ShuffleIcon from '@material-ui/icons/Shuffle';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';

// Service classes
import { fetchAudiosAsync, FetchAudiosInput, FetchAudioOutput } from '../../service/tracksService';

// Contexts
import { UserDataContext, IUserDataStateHooks } from '../../App';

// Common
import { sizeOfFetchingTrackDatAtOnce } from '../../common/const';
import { msgNoTracksSelected } from '../../common/message';
import { AppName } from '../../common/const';

// Router
import { useHistory } from 'react-router-dom';

// Make custom styles
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    // Track list table.
    trackListWrapper: {
      height: '60vh',
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
    // fabInFab3: {
    //   position: 'absolute',
    //   bottom: theme.spacing(26),
    //   right: theme.spacing(2),
    //   [theme.breakpoints.up('md')]: {
    //     bottom: theme.spacing(30),
    //     right: theme.spacing(6),
    //   },
    // },
    fabInFab2: {
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
    sortIcon: {
      padding: '10px 0px 0px 10px',
    },
    loadingCircle: {
      padding: '20px 0px 10px 0px',
      textAlign: 'center',
    },
  })
);

type TracksListProps = {
  id: string;
  title: string;
  artist: string;
  album: string;
  genre: string;
  track: number;
  isChecked: boolean;
};

export const Tracks: React.FC = () => {
  const classes = useStyles();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('md'));
  const UserDataHooks: IUserDataStateHooks = useContext(UserDataContext);
  const history = useHistory();

  /**
   *  States used in this component.
   */
  // NextToken from dynamodb.
  const [nextToken, setNextToken] = useState<string | null | undefined>('');
  // The tracks list to display on this tracks page.
  const [tracks, setTracks] = useState<(TracksListProps | undefined)[]>();
  type sortSettingProps = {
    sortKey: 'title' | 'album' | 'artist' | 'genre';
    order: 'asc' | 'desc';
  };
  const [sortSetting, setSortSetting] = useState<sortSettingProps>({
    sortKey: 'title',
    order: 'asc',
  });
  // Whether has more track metadata in dynamodb.
  const [hasMoreTracks, setHasMoreTracks] = useState<boolean>(true);
  // Whether is fetching data now.
  const [isFetching, setIsFetching] = useState(false);
  // Controls floationg action button.
  const [isFabActive, setIsFabActive] = useState(false);
  const handleControlActiveToggle = () => {
    setIsFabActive(!isFabActive);
  };
  // AudioIds to play in player page.
  const [tracksToBePlayedSet, setTracksToBePlayedSet] = useState<Set<string>>(new Set());
  // Whether is checked the checkbox that controls all ones.
  const [isCheckedHeaderCheckbox, setIsCheckedHeaderCheckbox] = useState<boolean>(false);
  // Alert field.
  const [alerts, setAlerts] = useState<TAlert[]>([]);
  const handleAlerts = (alert: TAlert) => {
    setAlerts((prevAlerts) => {
      const alerts = [...prevAlerts, alert];
      return alerts;
    });
  };

  /**
   * Handles sort operation by sort key.
   * 1. Set sort key specified to sort setting state.
   * 2. Execute sorting operation by sort setting.
   * @param {'title' | 'album' | 'artist' | 'genre'} sortKey
   */
  const handleSort: (sortKey: 'title' | 'album' | 'artist' | 'genre') => void = (sortKey) => {
    let order: 'asc' | 'desc' = 'asc';
    if (sortSetting.sortKey == sortKey) {
      // If sort key selected  already using, reverse sort order.
      order = sortSetting.order === 'asc' ? 'desc' : 'asc';
    }

    const sortSettingProps: sortSettingProps = {
      sortKey: sortKey,
      order: order,
    };
    // Set sortSetting state.
    setSortSetting(sortSettingProps);

    // Executes sorting!
    sortTracks(sortSettingProps);
  };

  /**
   * Execute sorting operation by sort setting props.
   *
   * @param {*} sortSettingProps
   * @return {void}
   */
  const sortTracks: (sortSettingProps: sortSettingProps) => void = (sortSettingProps) => {
    if (!tracks || !sortSettingProps.sortKey) {
      return;
    }
    // compare logic using in Array.sort()
    const compareValues: (
      key: 'title' | 'album' | 'artist' | 'genre',
      order: 'asc' | 'desc'
    ) => (a: TracksListProps | undefined, b: TracksListProps | undefined) => number = (
      key,
      order = 'asc'
    ) => {
      return (a, b) => {
        if (!a || !b) {
          return 0;
        }

        // When either keys are missing.
        if (
          !Object.prototype.hasOwnProperty.call(a, key) ||
          !Object.prototype.hasOwnProperty.call(b, key)
        ) {
          // property doesn't exist on either object
          return 0;
        }

        const varA = typeof a[key] === 'string' ? a[key].toUpperCase() : a[key];
        const varB = typeof b[key] === 'string' ? b[key].toUpperCase() : b[key];

        let comparison = 0;
        if (varA > varB) {
          comparison = 1;
        } else if (varA < varB) {
          comparison = -1;
        }
        return order == 'desc' ? comparison * -1 : comparison;
      };
    };

    // Execute sort tracks!
    if (tracks) {
      tracks.sort(compareValues(sortSettingProps.sortKey, sortSettingProps.order));
    }
  };

  const handleCheckboxChange: (checkedTrackId: string) => void = (checkedTrackId) => {
    // const checkedTrackId = e.currentTarget.childNodes[0].childNodes[0].defaultValue;
    const newTracksToBePlayedSet = new Set([...tracksToBePlayedSet]);
    if (tracksToBePlayedSet.has(checkedTrackId)) {
      // If the track id checked is already existed in the playlist, remove it from the one.
      newTracksToBePlayedSet.delete(checkedTrackId);
    } else {
      // If the track id checked is missing in the play list, append it in the one.
      newTracksToBePlayedSet.add(checkedTrackId);
    }
    setTracksToBePlayedSet(newTracksToBePlayedSet);
  };

  // Handles checked or unchecked of all checkboxes.
  const handleAllCheckBoxChange: () => void = () => {
    if (isCheckedHeaderCheckbox) {
      // Uncheck all
      setTracksToBePlayedSet(new Set());
    } else {
      // Check all
      if (tracks) {
        const trackIds: string[] = [];
        tracks.forEach((track) => {
          if (track) trackIds.push(track.id);
        });
        if (trackIds) {
          setTracksToBePlayedSet(new Set(trackIds));
        }
      }
    }

    // Set checked status reversed.
    setIsCheckedHeaderCheckbox(!isCheckedHeaderCheckbox);
  };

  const handlePlayTracksFabOnClick: () => void = () => {
    // Init alert field.
    setAlerts([]);
    // Init temporary playlist in local storage.
    localStorage.setItem(AppName + 'TemporaryPlayList', '');

    if (tracksToBePlayedSet.size === 0) {
      console.warn('No audio file was found.');
      const description = msgNoTracksSelected();
      const alert: TAlert = {
        severity: 'warning',
        title: 'No tracks selected.',
        description: description,
      };
      handleAlerts(alert);
      return;
    } else {
      // Save temporary PlayList in local storage.
      localStorage.setItem(AppName + 'TemporaryPlayList', [...tracksToBePlayedSet].join(','));
      // Send to player page.
      history.push('/player');
    }
  };

  // Transition setting using in floationg action button.
  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  };

  // Input props of fetch audio function.
  const fetchAudioInput: FetchAudiosInput = {
    username: UserDataHooks.user.username,
    limit: sizeOfFetchingTrackDatAtOnce,
    prevNextToken: nextToken,
  };

  /**
   * Fetchs audio metadata in dynamodb
   */
  const fetchAudioMetaDataAsync = async () => {
    try {
      setIsFetching(true);

      // Fetch audio metadata from dynamodb
      const fetchAudioOutput: FetchAudioOutput = await fetchAudiosAsync(fetchAudioInput);
      const fetchedTracks: (TracksListProps | undefined)[] = fetchAudioOutput.fetchAudioOutput.map(
        (item) => {
          if (item) {
            return {
              id: item.id,
              title: item.title,
              artist: item.artist,
              album: item.album,
              genre: item.genre,
              track: item.track,
              isChecked: false,
            };
          }
        }
      );

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

  // Icon components of sort status using in table header.
  const sortIcon = (sortKey: 'title' | 'album' | 'artist' | 'genre') => {
    if (sortKey === sortSetting.sortKey) {
      return sortSetting.order === 'asc' ? (
        <ArrowUpwardIcon fontSize="default" className={classes.sortIcon} />
      ) : (
        <ArrowDownwardIcon fontSize="default" className={classes.sortIcon} />
      );
    }
  };

  // Table header components of tracks
  const trackTableHeader = tracks && (
    <TableContainer component={Paper}>
      <Table stickyHeader={true} aria-label="tracks table">
        <TableHead>
          <TableRow>
            <TableCell className={classes.tableCellCheckbox}>
              <Checkbox
                size="small"
                inputProps={{ 'aria-label': 'primary checkbox' }}
                onClick={handleAllCheckBoxChange}
                checked={isCheckedHeaderCheckbox}
              />
            </TableCell>
            <TableCell className={classes.tableCellTitle} onClick={() => handleSort('title')}>
              Title
              {sortIcon('title')}
            </TableCell>
            <TableCell className={classes.tableCellArtist} onClick={() => handleSort('artist')}>
              Artist
              {sortIcon('artist')}
            </TableCell>
            <TableCell className={classes.tableCellAlbum} onClick={() => handleSort('album')}>
              Album
              {sortIcon('album')}
            </TableCell>
            {/* <TableCell className={classes.tableCellTrack}>Track</TableCell> */}

            {/* Show only pc or tablet */}
            {matches && (
              <TableCell className={classes.tableCellGenre} onClick={() => handleSort('genre')}>
                Genre
                {sortIcon('genre')}
              </TableCell>
            )}
          </TableRow>
        </TableHead>
      </Table>
    </TableContainer>
  );

  // Table data components of tracks
  const trackTable = tracks && (
    <TableContainer component={Paper}>
      <Table stickyHeader={true} aria-label="tracks table">
        <TableBody>
          {tracks.map(
            (track) =>
              track && (
                <TableRow
                  hover
                  role="checkbox"
                  tabIndex={-1}
                  key={track.id}
                  onClick={() => handleCheckboxChange(track.id)}
                >
                  <TableCell className={classes.tableCellCheckbox}>
                    <Checkbox
                      size="small"
                      inputProps={{ 'aria-label': 'primary checkbox' }}
                      checked={tracksToBePlayedSet.has(track.id)}
                      value={track.id}
                    />
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

  // CircleProgress components while fetching items.
  const loadingCircle = isFetching && (
    <div className={classes.loadingCircle}>
      <CircularProgress color="secondary" />
    </div>
  );

  // Parameters of loationg action button components.
  const fabs = [
    {
      key: 'fab-open',
      in: !isFabActive,
      timeout: transitionDuration,
      style: {
        transitionDelay: `${!isFabActive ? transitionDuration.exit : 0}ms`,
      },
      color: 'secondary',
      className: classes.fab,
      onClick: handleControlActiveToggle,
      icon: <AddIcon />,
      variant: 'round',
    },
    {
      key: 'fab-close',
      in: isFabActive,
      timeout: transitionDuration,
      style: {
        transitionDelay: `${isFabActive ? transitionDuration.exit : 0}ms`,
      },
      color: 'secondary',
      className: classes.fab,
      onClick: handleControlActiveToggle,
      icon: <CloseIcon />,
      variant: 'round',
    },
    {
      key: 'fab-play-selected',
      in: isFabActive,
      timeout: transitionDuration,
      style: {
        transitionDelay: `${isFabActive ? transitionDuration.exit + 60 : 0}ms`,
      },
      color: 'primary',
      className: classes.fabInFab2,
      onClick: handlePlayTracksFabOnClick,
      icon: (
        <>
          <span className={classes.fabButtonText}>Play tracks selected</span>
          <PlayArrowIcon />
        </>
      ),
      variant: 'extended',
    },
    // {
    //   key: 'fab-play-random',
    //   in: isFabActive,
    //   timeout: transitionDuration,
    //   style: {
    //     transitionDelay: `${isFabActive ? transitionDuration.exit + 35 : 0}ms`,
    //   },
    //   color: 'primary',
    //   className: classes.fabInFab3,
    //   onClick: handleControlActiveToggle,
    //   icon: (
    //     <>
    //       <span className={classes.fabButtonText}>Play Random</span>
    //       <ShuffleIcon />
    //     </>
    //   ),
    //   variant: 'extended',
    // },
    {
      key: 'fab-add-playlist',
      in: isFabActive,
      timeout: transitionDuration,
      style: {
        transitionDelay: `${isFabActive ? transitionDuration.exit + 10 : 0}ms`,
      },
      color: 'primary',
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
      {/* Fixed header */}
      <PageContainer h2Text="Tracks">
        <AlertField alerts={alerts} />

        {/* Table header */}
        {trackTableHeader}
        {/* Table data with infinite scroller */}
        <div className={classes.trackListWrapper}>
          <InfiniteScroll
            pageStart={0}
            loadMore={fetchAudioMetaDataAsync}
            hasMore={!isFetching && hasMoreTracks}
            initialLoad={true}
            useWindow={false}
          >
            {trackTable}
          </InfiniteScroll>
          {loadingCircle}
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
