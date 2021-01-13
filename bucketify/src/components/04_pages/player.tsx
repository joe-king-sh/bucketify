import React, { useState, useRef, useEffect, useContext } from 'react';

// AWS SDK
import AWS from 'aws-sdk';
import { GetObjectRequest } from 'aws-sdk/clients/s3';

// 3rd party libs
import * as musicMetadata from 'music-metadata-browser';
import * as mm from 'music-metadata';

// Styles
import clsx from 'clsx';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
// import { useTheme } from '@material-ui/core/styles';
// import useMediaQuery from '@material-ui/core/useMediaQuery';

// Template
import PageContainer from '../02_organisms/pageContainer';

// Icons
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import PauseCircleFilled from '@material-ui/icons/PauseCircleFilled';

// Router
import { useHistory } from 'react-router-dom';

// Contexts
import { UserDataContext, IUserDataStateHooks } from '../../App';

// Components
import { Typography, Box } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';

// Service classes
import {
  fetchAudioMetaDataByAudioIdAsync,
  FetchAudioMetaDataByAudioIdOutput,
} from '../../service/tracksService';

// Common
import { AppName } from '../../common/const';

// My components
// import MyTypographyH3 from '../01_atoms_and_molecules/myTypographyh3';

// Make custom styles
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    // Back arrow icon
    backArrowIcon: {
      zIndex: 10,
      position: 'absolute',
      top: '5.5rem',
      left: '2rem',
      color: 'white',
      [theme.breakpoints.up('md')]: {
        display: 'none',
      },
    },
    albumTitle: {
      // fontSize: '1rem',
      // fontWeight: 600,
      textAlign: 'center',
      margin: 'auto',
      // margin: 'auto auto 1rem auto',
      maxWidth: '80%',
    },
    albumArtWork: {
      margin: '0 auto 0 auto',
      textAlign: 'center',
      width: '90%',
      [theme.breakpoints.up('sm')]: {
        width: '75%',
      },
      [theme.breakpoints.up('md')]: {
        width: '60%',
      },
    },
    albumArtWorkSkelton: {
      margin: '1rem 0 1rem 0',
      width: '100%',
      paddingTop: '100%',
      // height: '90%',
      display: 'inline-block',
    },
    albumArtWorkImage: {
      margin: '1rem 0 1rem 0',
      width: '100%',
      // height: '90%',
      display: 'inline-block',
    },
    alignLeft: {
      textAlign: 'left',
    },
    alignRight: {
      textAlign: 'right',
    },
    seekbar: {
      height: '5px',
      margin: '0.5rem auto 0.5rem auto',
      borderRadius: '4px',
      background: 'linear-gradient(#ff6904, #ff6904) no-repeat #eee',
      backgroundSize: '0%',
      cursor: 'pointer',
    },
    // timeWrapper: {
    // },
    time: {
      display: 'inline-block',
      width: '50%',
      fontSize: '0.75rem',
    },
    controlButtonWrapper: {
      margin: '0 0 1rem 0',
      textAlign: 'center',
    },
    controlButton: {
      display: 'inline-block',
      margin: '0 0.5rem 0 0.5rem',
      cursor: 'pointer',
    },
    controlButtonPause: {
      boxShadow: '0 0 0 rgba(255,104,8, 0.4)',
      animation: '$pulse 2s infinite',
      borderRadius: '50%',
    },
    displayNone: {
      display: 'none',
    },
    // Pulse animation for the pause button when playing tracks.
    '@keyframes pulse': {
      '0%': {
        boxShadow: '0 0 0 0 rgba(255,104,8, 0.4)',
      },
      '70%': {
        boxShadow: '0 0 0 10px rgba(255,104,8, 0)',
      },
      '100%': {
        boxShadow: '0 0 0 0 rgba(255,104,8, 0)',
      },
    },
    // @keyframes pulse {
    //   0% {
    //     -moz-box-shadow: '0 0 0 0 rgba(255,104,8, 0.4'),
    //     box-shadow: '0 0 0 0 rgba(255,104,8, 0.4'),
    //   }
    //   70% {
    //       -moz-box-shadow: '0 0 0 10px rgba(255,104,8, 0'),
    //       box-shadow: '0 0 0 10px rgba(255,104,8, 0'),
    //   }
    //   100% {
    //       -moz-box-shadow: '0 0 0 0 rgba(255,104,8, 0)',
    //       box-shadow: '0 0 0 0 rgba(255,104,8, 0)',
    //   }
    // }
  })
);

const Player: React.FC = () => {
  const classes = useStyles();
  // const theme = useTheme();
  // const matches = useMediaQuery(theme.breakpoints.up('md'));
  const history = useHistory();
  const UserDataHooks: IUserDataStateHooks = useContext(UserDataContext);

  // Get play list from localstorage.
  const temporaryPlayListTracksIds = localStorage
    .getItem(AppName + 'TemporaryPlayList')
    ?.split(',');
  if (temporaryPlayListTracksIds === undefined || temporaryPlayListTracksIds.length === 0) {
    // When no tracks were selected.
    history.goBack();
    return <></>;
  }

  /**
   *  States used in this component.
   */
  // Whether is fetching data now.
  const [nowPlayingTracksId, setNowPlayingTracksId] = useState({
    order: 0,
    nowPlayingTrackId: temporaryPlayListTracksIds[0],
  });
  const [
    nowPlayingTrackMetaData,
    setNowPlayingTrackMetaData,
  ] = useState<FetchAudioMetaDataByAudioIdOutput | null>(null);
  const [nowPlayingS3SignedUrl, setNowPlayingS3SignedUrl] = useState('');

  // Whether is fetching album cover.
  const [isFetchingAlbumCover, setIsFetchingAlbumCover] = useState(true);
  const [isNowPlaying, setIsNowPlaying] = useState(false);

  // References to elements that controls audio player.
  const audio = useRef<HTMLAudioElement>(null);
  const seakBar = useRef<HTMLDivElement>(null);
  const currentSpan = useRef<HTMLSpanElement>(null);
  const durationSpan = useRef<HTMLSpanElement>(null);
  const albumArtWorkImage = useRef<HTMLImageElement>(null);

  // oncLick controls.
  const handleClickPlayButton: () => void = () => {
    if (!audio || !audio.current) {
      return;
    }
    audio.current.play();
    setIsNowPlaying(!isNowPlaying);
  };
  const handleClickPauseButton: () => void = () => {
    if (!audio || !audio.current) {
      return;
    }
    audio.current.pause();
    setIsNowPlaying(!isNowPlaying);
  };
  const handleClickNextButton: () => void = () => {
    if (temporaryPlayListTracksIds.length == nowPlayingTracksId.order + 1) {
      return;
    } else {
      const newOrder = nowPlayingTracksId.order + 1;
      const newNowPlay = {
        order: newOrder,
        nowPlayingTrackId: temporaryPlayListTracksIds[newOrder],
      };
      setNowPlayingTracksId(newNowPlay);
      setIsFetchingAlbumCover(true);
      resetAudioContorols();
    }
  };
  const handleClickPrevButton: () => void = () => {
    if (nowPlayingTracksId.order == 1) {
      return;
    } else {
      const newOrder = nowPlayingTracksId.order - 1;
      const newNowPlay = {
        order: newOrder,
        nowPlayingTrackId: temporaryPlayListTracksIds[newOrder - 1],
      };
      setNowPlayingTracksId(newNowPlay);
      setIsFetchingAlbumCover(true);
      resetAudioContorols();
    }
  };
  /**
   *  useEffect
   */
  // Set event listner to play tracks.
  useEffect(() => {
    if (!audio || !audio.current) {
      return;
    } else {
      // Update duration displayed and seekBar.
      audio.current.addEventListener('timeupdate', () => {
        if (!audio || !audio.current) {
          return;
        }
        const current = Math.floor(audio.current.currentTime);
        const duration = Math.round(audio.current.duration);
        // console.log(current, duration);
        if (!isNaN(duration)) {
          if (
            currentSpan &&
            currentSpan.current &&
            durationSpan &&
            durationSpan.current &&
            seakBar &&
            seakBar.current
          ) {
            currentSpan.current.innerHTML = playTimeFormatHelper(current);
            durationSpan.current.innerHTML = playTimeFormatHelper(duration);
            const percent =
              Math.round((audio.current.currentTime / audio.current.duration) * 1000) / 10;
            seakBar.current.style.backgroundSize = percent + '%';

            // When playing track was ended, reset seakbar and current duration.
            // Also listening to 'ended' event, but it may be not working, so do the same things on here.
            if (current === duration) {
              resetAudioContorols();
            }
          }
        }
      });

      // Set duration to play a track until the end.
      audio.current.addEventListener('durationchange', () => {
        if (!audio || !audio.current) {
          return;
        }
        const duration = Math.round(audio.current.duration);
        if (!isNaN(duration)) {
          if (!seakBar || !seakBar.current) {
            return;
          }
          seakBar.current.setAttribute('max', Math.round(audio.current.duration).toString());
        }
      });

      // OnEnded play tracks, reset seakbar and current duration.
      audio.current.addEventListener('ended', () => {
        if (!audio || !audio.current) {
          return;
        }
        resetAudioContorols();
      });

      // OnClick seakbar event to change now playing position.
      if (!seakBar || !seakBar.current) {
        return;
      }
      seakBar.current.addEventListener('click', (e) => {
        if (!audio || !audio.current) {
          return;
        }
        const duration = Math.round(audio.current.duration);
        if (!isNaN(duration)) {
          if (!seakBar || !seakBar.current) {
            return;
          }
          const mouse = e.pageX;
          const rect = seakBar.current.getBoundingClientRect();
          const position = rect.left + window.pageXOffset;
          const offset = mouse - position;
          const width = rect.right - rect.left;
          audio.current.currentTime = Math.round(duration * (offset / width));
        }
      });
    }
  }, []);

  // Fetch metadata from tracks.
  useEffect(() => {
    const fetchMetadataFromTrackId = async () => {
      const audioMetaData = await fetchAudioMetaDataByAudioIdAsync(
        nowPlayingTracksId.nowPlayingTrackId,
        UserDataHooks.user.username
      );
      console.log(audioMetaData);
      if (!audioMetaData || !audio.current) {
        return;
      }
      const params: GetObjectRequest = {
        Bucket: audioMetaData?.s3BucketName,
        Key: audioMetaData?.s3ObjectKey,
      };
      // Init sdk.
      const s3 = new AWS.S3({
        // region: 'ap-northeast-1',
        region: 'us-east-1',
        maxRetries: 5,
        accessKeyId: audioMetaData?.accessKey,
        secretAccessKey: audioMetaData?.secretAccessKey,
      });

      // Get Signed url.
      const s3SignedUrl = await s3.getSignedUrl('getObject', params);
      setNowPlayingS3SignedUrl(s3SignedUrl);
      console.log(nowPlayingTrackMetaData);
      setNowPlayingTrackMetaData(audioMetaData);
      console.log(nowPlayingTrackMetaData);
    };
    fetchMetadataFromTrackId();
  }, [nowPlayingTracksId]);

  // Fetch album artwork from tracks
  useEffect(() => {
    const fetchAlbumArtWork = async () => {
      console.log('signedurl:' + nowPlayingS3SignedUrl);
      const metadata: musicMetadata.IAudioMetadata = await musicMetadata.fetchFromUrl(
        nowPlayingS3SignedUrl
      );

      if (!albumArtWorkImage.current) {
        return;
      }
      if (metadata.common.picture) {
        console.info('album art cover was found.');
        console.log(metadata.common.picture);
        const cover = mm.selectCover(metadata.common.picture);
        console.log(cover);
        setIsFetchingAlbumCover(false);
        if (cover) {
          albumArtWorkImage.current.src = URL.createObjectURL(
            new Blob([cover.data], { type: cover.format } /* (1) */)
          );
        }
      }
    };
    if (nowPlayingS3SignedUrl !== '') {
      fetchAlbumArtWork();
    }
  }, [nowPlayingS3SignedUrl]);

  // Helper function to display time of tracks.
  const playTimeFormatHelper: (t: number) => string = (t) => {
    let hms = '';
    const h = (t / 3600) | 0;
    const m = ((t % 3600) / 60) | 0;
    const s = t % 60;
    const z2: (v: number) => string = (v) => {
      const s = '00' + v;
      return s.substr(s.length - 2, 2);
    };
    if (h != 0) {
      hms = h + ':' + z2(m) + ':' + z2(s);
    } else if (m != 0) {
      hms = z2(m) + ':' + z2(s);
    } else {
      hms = '00:' + z2(s);
    }
    return hms;
  };

  // Helper function reset controls when stop playing.
  const resetAudioContorols: () => void = () => {
    setIsNowPlaying(false);
    if (!seakBar || !seakBar.current || !currentSpan || !currentSpan.current) {
      return;
    }
    seakBar.current.style.backgroundSize = '0%';
    currentSpan.current.innerHTML = '00:00';
  };

  return (
    <>
      <PageContainer>
        <ArrowBackIosIcon
          className={classes.backArrowIcon}
          onClick={() => {
            history.goBack();
          }}
        />
        <Typography variant="h5" component="h3" className={classes.albumTitle}>
          {nowPlayingTrackMetaData?.album}
        </Typography>

        <Box className={classes.albumArtWork}>
          {isFetchingAlbumCover && (
            <Skeleton variant="rect" className={classes.albumArtWorkSkelton} />
          )}
          <img
            alt="AlbumArtCover"
            className={clsx(classes.albumArtWorkImage, isFetchingAlbumCover && classes.displayNone)}
            ref={albumArtWorkImage}
            src="images/noimage.png"
          />
        </Box>

        <section className={classes.alignLeft}>
          <p>
            <b> {nowPlayingTrackMetaData?.title}</b>
          </p>

          <p>{nowPlayingTrackMetaData?.artist}</p>
        </section>

        <audio preload="true" ref={audio}>
          <source src={nowPlayingS3SignedUrl} />
          <p>※ ご利用のブラウザでは再生することができません。</p>
        </audio>

        <div id="seekbar" className={classes.seekbar} ref={seakBar}></div>

        <Box id="time-wrapper">
          <span id="current" className={classes.alignLeft + ' ' + classes.time} ref={currentSpan}>
            00:00
          </span>
          <span
            id="duration"
            className={classes.alignRight + ' ' + classes.time}
            ref={durationSpan}
          >
            00:00
          </span>
        </Box>

        <Box id="control-button" className={classes.controlButtonWrapper}>
          <SkipPreviousIcon
            fontSize="large"
            color={nowPlayingTracksId.order == 0 ? 'disabled' : 'secondary'}
            className={classes.controlButton}
            onClick={nowPlayingTracksId.order == 0 ? undefined : handleClickPrevButton}
          />

          {!isNowPlaying && (
            <PlayCircleFilledIcon
              fontSize="large"
              color="secondary"
              className={classes.controlButton}
              onClick={handleClickPlayButton}
            />
          )}

          {isNowPlaying && (
            <PauseCircleFilled
              fontSize="large"
              color="secondary"
              className={classes.controlButton + ' ' + classes.controlButtonPause}
              onClick={handleClickPauseButton}
            />
          )}
          <SkipNextIcon
            fontSize="large"
            color={
              temporaryPlayListTracksIds.length == nowPlayingTracksId.order + 1
                ? 'disabled'
                : 'secondary'
            }
            className={classes.controlButton}
            onClick={
              temporaryPlayListTracksIds.length == nowPlayingTracksId.order + 1
                ? undefined
                : handleClickNextButton
            }
          />
        </Box>
      </PageContainer>
    </>
  );
};
export default Player;
