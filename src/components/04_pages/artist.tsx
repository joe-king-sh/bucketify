import React, {
  // ReactNode,
  useEffect,
  useState,
  useContext,
} from 'react';

// Styles
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import clsx from 'clsx';

// 3rd party lib
import AnchorLink from 'react-anchor-link-smooth-scroll';
// import InfiniteScroll from 'react-infinite-scroller';

// Router
import { Link } from 'react-router-dom';

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
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';

// MyComponents
import AlertField, { TAlert } from '../02_organisms/alert';
import { CustomizedSnackBar } from '../02_organisms/snackBar';
import MyTypographyH3 from '../01_atoms_and_molecules/myTypographyh3';

// Icons
import AddIcon from '@material-ui/icons/Add';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import CloseIcon from '@material-ui/icons/Close';

// Service classes
import {
  fetchArtistsByUserIdAsync,
  FetchArtistsByUserIdInput,
  fetchAudioDataByAudioIdsAsync,
  FetchAudioDataByAudioIdsInput,
  FetchAudioMetaDataByAudioIdOutput,
} from '../../service/artistsService';

// Contexts
import { UserDataContext, IUserDataStateHooks, LanguageContext } from '../../App';

// Common
import { AppName } from '../../common/const';

// Router
import { useHistory } from 'react-router-dom';

// Translation
import { useTranslation } from 'react-i18next';

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
    tableCellTrack: {
      width: '5%',
      textAlign: 'right',
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

    link: {
      textDecoration: 'none',
      color: theme.palette.text.primary,
    },

    albumDetailWrapper: {
      margin: '10px 0px 30px 0px',
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

export const Artists: React.FC = () => {
  // Styles
  const classes = useStyles();
  const theme = useTheme();
  const isMatchesOverMd = useMediaQuery(theme.breakpoints.up('md'));
  const UserDataHooks: IUserDataStateHooks = useContext(UserDataContext);
  const history = useHistory();

  // Language setting.
  const LanguageContextHooks = useContext(LanguageContext);
  const [t, i18n] = useTranslation();
  useEffect(() => {
    i18n.changeLanguage(LanguageContextHooks.languageState);
  }, [LanguageContextHooks.languageState, i18n]);

  /**
   *  States used in this component.
   */
  const [audioIdByArtistMap, setAudioIdByArtistMap] = useState(new Map<string, Array<string>>());

  // Current selected artist name.
  const [selectedArtistName, setSelectedArtistName] = useState('');
  // Current processing album.
  // const [nowProcessingAlbum, setNowProcessingAlbum] = useState('');

  // Whether is fetching data now.
  const [isArtistFetching, setIsArtistFetching] = useState(false);
  const [isTrackFetching, setIsTrackFetching] = useState(false);

  // Controls floationg action button.
  const [isFabActive, setIsFabActive] = useState(false);
  const handleControlActiveToggle = () => {
    setIsFabActive(!isFabActive);
  };

  // Now selected artst's track no
  const [tracksOfNowSelectedArtist, setTracksOfNowSelectedArtist] = useState<
    (TracksListProps | undefined)[]
  >();

  // AudioIds to play in player page.
  const [tracksToBePlayedMap, setTracksToBePlayedMap] = useState(new Map());

  // Whether is checked the checkbox that controls all ones.
  // Alert field.
  const [alerts, setAlerts] = useState<TAlert[]>([]);
  const handleAlerts = (alert: TAlert) => {
    setAlerts((prevAlerts) => {
      const alerts = [...prevAlerts, alert];
      return alerts;
    });
  };
  // Snack bar to notify under construction page.
  const [showSnackBar, setShowSnackBar] = useState(false);

  // Input props of fetch artists function.
  const fetchArtistsByUserIdInput: FetchArtistsByUserIdInput = {
    username: UserDataHooks.user.username,
  };
  // Fetch artist's names from dynamodb
  useEffect(() => {
    const fetchArtistsDataAsync = async () => {
      console.log('START fetch artist by useid async');
      setIsArtistFetching(true);
      const artistsNameFetchResult = await fetchArtistsByUserIdAsync(fetchArtistsByUserIdInput);
      setAudioIdByArtistMap(artistsNameFetchResult.audioIdByArtistMap);
      setIsArtistFetching(false);
      console.log('END fetch artist by useid async');
    };
    fetchArtistsDataAsync();
  }, []);

  // Fetch artist's tracks from dynamodb
  useEffect(() => {
    const fetchTracksAsync = async () => {
      console.log('START fetch tracks by audioid async');

      const targetAudioIds = audioIdByArtistMap.get(selectedArtistName);
      if (targetAudioIds == undefined) {
        console.info('no audio id was found');
        return;
      }

      const fetchAudioDataByAudioIdsInput: FetchAudioDataByAudioIdsInput = {
        username: UserDataHooks.user.username,
        audioIds: targetAudioIds,
      };

      console.info('start fetching track list  by artist');
      setIsTrackFetching(true);
      setTracksOfNowSelectedArtist(undefined);

      const tracksData = await fetchAudioDataByAudioIdsAsync(fetchAudioDataByAudioIdsInput);

      // Sorting to be in order to  artist asc, album asc, track number asc.
      tracksData.fetchAudioOutput.sort(
        (a: FetchAudioMetaDataByAudioIdOutput, b: FetchAudioMetaDataByAudioIdOutput): number => {
          if (a == undefined || b == undefined) {
            return 1;
          }
          if (a.artist < b.artist) return -1;
          if (a.artist > b.artist) return 1;
          if (a.album < b.album) return -1;
          if (a.album > b.album) return 1;
          if (a.track < b.track) return -1;
          if (a.track > b.track) return 1;

          return 1;
        }
      );
      console.info(tracksData.fetchAudioOutput);

      setIsTrackFetching(false);
      console.info('end fetching track list  by artist');

      // Convert to state variable from db data.
      const fetchedTracks: (TracksListProps | undefined)[] = tracksData.fetchAudioOutput.map(
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
      setTracksOfNowSelectedArtist(fetchedTracks);

      console.log('END fetch tracks by audioid async');
    };
    fetchTracksAsync();
  }, [selectedArtistName]);

  const handlePlayTracksFabOnClick: () => void = () => {
    // Init alert field.
    setAlerts([]);
    // Init temporary playlist in local storage.
    localStorage.setItem(AppName + 'TemporaryPlayList', '');

    if (tracksToBePlayedMap.size === 0) {
      console.warn('No audio file was found.');
      const description = t('Please select tracks at least one');
      const alert: TAlert = {
        severity: 'warning',
        title: t('No tracks selected'),
        description: description,
      };
      handleAlerts(alert);
      return;
    } else {
      // Save temporary PlayList in local storage.
      localStorage.setItem(AppName + 'TemporaryPlayList', JSON.stringify([...tracksToBePlayedMap]));
      // Send to player page.
      history.push('/player');
    }
  };

  // Transition setting using in floationg action button.
  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  };

  // Artist section main components.
  const artistTable = (
    <TableContainer component={Paper}>
      <Table aria-label="artist table">
        <TableHead>
          <TableRow hover>
            <TableCell
            // className={classes.tableCellArtist}
            >
              <Link to="/track" className={classes.link}>
                {t('All Artists')}
              </Link>
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {console.log('creating table body')}
          {Array.from(audioIdByArtistMap.keys())
            .sort()
            .map((artistName) => {
              console.log(artistName);
              return (
                <TableRow
                  hover
                  // role="checkbox"
                  tabIndex={-1}
                  key={artistName}
                  selected={selectedArtistName == artistName}
                  onClick={() => handleArtistSelection(artistName)}
                >
                  <TableCell>
                    {!isMatchesOverMd ? (
                      <AnchorLink href="#tracks" offset="50" className={clsx(classes.link)}>
                        {artistName}
                      </AnchorLink>
                    ) : (
                      { artistName }
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </TableContainer>
  );
  const handleArtistSelection = (artistName: string) => {
    setSelectedArtistName(artistName);
  };

  // main part of track list that now selected.
  const TrackSection = () => {
    // Create a map object that contains tracklist by each artist name.
    const trackListByAlbumMap = new Map<string, Array<TracksListProps>>();

    if (!tracksOfNowSelectedArtist) {
      return;
    } else {
      let nowProcessingAlbum = '';
      tracksOfNowSelectedArtist.forEach((track) => {
        if (track == undefined) {
          return;
        }
        if (nowProcessingAlbum != track.album) {
          nowProcessingAlbum = track.album;
          trackListByAlbumMap.set(track.album, []);
        }
        // Regenerate map by each album name.
        trackListByAlbumMap.get(track.album)?.push(Object.assign({}, track));
      });
      console.info('track list by album name is below:');
      console.info({ trackListByAlbumMap });
    }

    return (
      <>
        {Array.from(trackListByAlbumMap.keys()).map((albumName) => {
          return (
            <TrackAlbumDetail
              albumName={albumName}
              tracksListInAlbum={trackListByAlbumMap.get(albumName)}
              tracksToBePlayedMap={tracksToBePlayedMap}
              setTracksToBePlayedMap={setTracksToBePlayedMap}
            />
          );
        })}
      </>
    );
  };

  // CircleProgress components while fetching items.
  const loadingCircle = (
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
          <span className={classes.fabButtonText}>{t('Play tracks selected')}</span>
          <PlayArrowIcon />
        </>
      ),
      variant: 'extended',
    },

    {
      key: 'fab-add-playlist',
      in: isFabActive,
      timeout: transitionDuration,
      style: {
        transitionDelay: `${isFabActive ? transitionDuration.exit + 10 : 0}ms`,
      },
      color: 'primary',
      className: classes.fabInFab1,
      onClick: () => setShowSnackBar(true),
      icon: (
        <>
          <span className={classes.fabButtonText}>{t('Add to Playlist')}</span>
          <PlaylistAddIcon />
        </>
      ),
      variant: 'extended',
    },
  ];

  return (
    <>
      {/* Fixed header */}
      <PageContainer h2Text={t('Artists')}>
        <AlertField alerts={alerts} />

        <Grid container spacing={3} alignItems="center" justify="center">
          {/* Artist Section */}
          <Grid item xs={12} sm={3} alignItems="center" justify="center">
            <div className={classes.trackListWrapper}>
              {artistTable}
              {isArtistFetching && loadingCircle}
            </div>
          </Grid>
          {/* Track Section */}
          <Grid item xs={12} sm={9} alignItems="center" justify="center">
            <b id="tracks">
              <MyTypographyH3>
                {selectedArtistName ? selectedArtistName : t('No artists is selected')}
              </MyTypographyH3>
            </b>
            <Divider />

            <div className={clsx(classes.trackListWrapper, classes.link)}>
              {TrackSection()}
              {isTrackFetching && loadingCircle}
            </div>
          </Grid>
        </Grid>
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

      <CustomizedSnackBar
        alert={{
          severity: 'info',
          title: '',
          description: t('Under construction'),
        }}
        isSnackBarOpen={showSnackBar}
        handleClose={(event?: React.SyntheticEvent, reason?: string) => {
          if (reason === 'clickaway') {
            return;
          }
          setShowSnackBar(false);
        }}
      />
    </>
  );
};

export interface ITrackToBePlayInfo {
  title: string;
  album: string;
  artist: string;
}
export interface ITrackAlbumDetail {
  // children: React.ReactNode;
  albumName: string;
  tracksListInAlbum: Array<TracksListProps> | undefined;
  tracksToBePlayedMap: Map<string, ITrackToBePlayInfo>;
  setTracksToBePlayedMap: React.Dispatch<React.SetStateAction<Map<string, ITrackToBePlayInfo>>>;
}
const TrackAlbumDetail: React.FC<ITrackAlbumDetail> = ({
  albumName,
  tracksListInAlbum,
  tracksToBePlayedMap,
  setTracksToBePlayedMap,
}) => {
  // Styles
  const classes = useStyles();
  // const theme = useTheme();

  const [isCheckedHeaderCheckbox, setIsCheckedHeaderCheckbox] = useState<boolean>(false);

  // // Handles checked or unchecked of all checkboxes.
  const handleAllCheckBoxChange: () => void = () => {
    const newTracksToBePlayedMap = new Map(tracksToBePlayedMap);
    if (isCheckedHeaderCheckbox) {
      // Uncheck all tracks about this album.
      tracksListInAlbum?.forEach((track) => {
        if (track) {
          newTracksToBePlayedMap.delete(track.id);
        }
      });
    } else {
      // Check all tracks about this album.
      tracksListInAlbum?.forEach((track) => {
        if (track) {
          newTracksToBePlayedMap.set(track.id, {
            title: track.title,
            album: track.album,
            artist: track.artist,
          });
        }
      });
    }
    setIsCheckedHeaderCheckbox(!isCheckedHeaderCheckbox);
    setTracksToBePlayedMap(newTracksToBePlayedMap);
  };

  const handleCheckboxChange: (track: TracksListProps) => void = (track) => {
    const newTracksToBePlayedMap = new Map(tracksToBePlayedMap);
    if (newTracksToBePlayedMap.has(track.id)) {
      // If the track id checked is already existed in the playlist, remove it from the one.
      newTracksToBePlayedMap.delete(track.id);
    } else {
      // If the track id checked is missing in the play list, append it in the one.
      newTracksToBePlayedMap.set(track.id, {
        title: track.title,
        album: track.album,
        artist: track.artist,
      });
    }
    setTracksToBePlayedMap(newTracksToBePlayedMap);
  };

  return (
    <>
      <div className={classes.albumDetailWrapper}>
        <p>{albumName}</p>
        <Divider />
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

                <TableCell className={classes.tableCellTrack}>Track</TableCell>
                <TableCell className={classes.tableCellTitle}>Title</TableCell>

                {/* Show only pc or tablet */}
                {/* {matches && (
                <TableCell className={classes.tableCellGenre}>
                  Genre
                </TableCell>
              )} */}
              </TableRow>
            </TableHead>

            <TableBody>
              {tracksListInAlbum?.map((track) => {
                console.info('now rendaring track part: ');
                console.info({ track });

                return (
                  track && (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={track.id}
                      onClick={() => handleCheckboxChange(track)}
                    >
                      <TableCell className={classes.tableCellCheckbox}>
                        <Checkbox
                          size="small"
                          inputProps={{ 'aria-label': 'primary checkbox' }}
                          checked={tracksToBePlayedMap.has(track.id)}
                          value={track.id}
                        />
                      </TableCell>
                      <TableCell component="th" scope="row" className={classes.tableCellCheckbox}>
                        {track.track}
                      </TableCell>
                      <TableCell component="th" scope="row" className={classes.tableCellTitle}>
                        {track.title}
                      </TableCell>
                      {/* <TableCell className={classes.tableCellTrack}>{track.track}</TableCell> */}
                    </TableRow>
                  )
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
};

export default Artists;
