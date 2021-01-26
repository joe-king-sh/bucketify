import React, { useRef, useContext, useEffect } from 'react';
import { AuthState } from '@aws-amplify/ui-components';

import Box from '@material-ui/core/Box';

// Style
import clsx from 'clsx';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
// import { useTheme } from '@material-ui/core/styles';
// import useMediaQuery from '@material-ui/core/useMediaQuery';

// Parallax
import { Parallax, ParallaxLayer } from 'react-spring/renderprops-addons';
import { Container, Paper, Typography } from '@material-ui/core';

// Image
import demoGifPC from '../../images/bucketify_demo_pc.gif';
import architecture from '../../images/architecture.drawio.svg';

// MyComponents
import ResponsiveButton from '../01_atoms_and_molecules/responsiveButton';

// Material-ui
import Grid from '@material-ui/core/Grid';

// Router
import { useHistory } from 'react-router-dom';

// Context
import { AuthContext } from '../../App';

//Styles
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    landingTopWrapper: {
      backgroundImage: 'url("images/bg-landing.jpg")',
      backgroundSize: 'cover',
      height: '100%',
      backgroundPosition: '50% 50%',
      // [theme.breakpoints.down('lg')]: {
      //   backgroundImage: 'url("images/bg-landing-tablet.jpg")',
      // },
      // [theme.breakpoints.down('md')]: {
      //   backgroundImage: 'url("images/bg-landing-mobile.jpg")',
      // },
    },
    topWrapperCatchCopy: {
      color: 'white',
      textShadow: '1px 2px 3px #4b4b4b',
    },
    buttonWrapper: {
      textAlign: 'center',
      padding: '3rem 0 1rem 0',
    },
    sectionWrapper: {
      // width: '90%',
      margin: 'auto',
      [theme.breakpoints.down('md')]: {
        align: 'center',
      },
    },
    sectionHeader: {
      padding: '2rem 0 1.5rem 0rem',
    },
    defaultBackGroundWrapper: {
      backgroundColor: theme.palette.background.default,
    },
    introductionDemoWrapper: {
      textAlign: 'center',
    },
    introductionDemo: {
      width: '95%',
      borderRadius: '7px',
      // margin: 'auto',
      // display: 'inline-block',
      // textAlign: 'center',
    },
    introductionText: {
      padding: '1.75rem 1.5rem 1.75rem 1.5rem',
    },

    howItWorksWrapperEdgeTop: {
      paddingBottom: 'calc(10vw + 10px)',
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: theme.palette.background.default,

      '&::before': {
        content: '""',
        position: 'absolute',
        bottom: '0',
        left: '0',
        borderBottom: '10vw solid ' + theme.palette.secondary.main,
        borderLeft: '100vw solid transparent',
      },
    },
    howItWorksWrapper: {
      backgroundColor: theme.palette.secondary.main,
      paddingBottom: 'calc(10vw + 10px)',
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '"aa"',
        position: 'absolute',
        bottom: '0',
        left: '0',
        borderBottom: '10vw solid ' + theme.palette.background.default,
        borderLeft: '100vw solid transparent',
      },
    },
    howItWorksImageWrapper: {
      textAlign: 'center',
    },
    howItWorksImage: {
      width: '95%',
      borderRadius: '15px',
      backgroundColor: '#f0f8ff',
      padding: '35px',
    },
    howToUseWrapper: {
      backgroundColor: '#f0f8ff',
      // height: '75%',
    },
  })
);
const Landing: React.FC = () => {
  const classes = useStyles();
  const parallaxRef = useRef<Parallax>(null);

  const AuthStateHooks = useContext(AuthContext);
  const history = useHistory();
  useEffect(() => {
    console.log('Check whether the user has already signed in or not.');

    // If ther user already signed in, push history /accounts.
    if (AuthStateHooks.authState === AuthState.SignedIn) {
      console.log('you have already signd in. push history to accounts');
      history.push('/accounts');
    }
  }, [history, AuthStateHooks.authState]);

  // const theme = useTheme();
  // const isMatchesOverMd = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <Box>
      {/* https://www.react-spring.io/docs/props/parallax */}

      <Parallax pages={4} ref={parallaxRef}>
        {/* Top Wrapper */}
        <ParallaxLayer offset={0} speed={0} factor={1.25}>
          <Box className={clsx(classes.landingTopWrapper)}></Box>
        </ParallaxLayer>
        <ParallaxLayer offset={0.25} speed={0.75}>
          <Typography
            variant="h2"
            component="h2"
            align="center"
            className={clsx(classes.topWrapperCatchCopy)}
          >
            Everything
            <br />
            is
            <br />
            in your bucket.
          </Typography>
        </ParallaxLayer>
        <ParallaxLayer offset={0.65} speed={0.75}>
          <Box className={clsx(classes.buttonWrapper)}>
            <ResponsiveButton
              onClick={() => {
                if (parallaxRef !== null && parallaxRef.current !== null) {
                  parallaxRef.current.scrollTo(1);
                }
              }}
              variant="contained"
              color="secondary"
            >
              Learn More
            </ResponsiveButton>
          </Box>
        </ParallaxLayer>

        {/* Introduction */}
        <ParallaxLayer offset={1} speed={1} factor={0.75}>
          <Box className={clsx(classes.defaultBackGroundWrapper)}>
            <Container maxWidth="lg" className={clsx(classes.sectionWrapper)}>
              <Typography variant="h3" component="h3" className={classes.sectionHeader}>
                Introduction
              </Typography>

              <Grid container spacing={3} alignItems="center" justify="center">
                <Grid
                  item
                  xs={12}
                  sm={6}
                  alignItems="center"
                  justify="center"
                  className={classes.introductionDemoWrapper}
                >
                  <Box>
                    <img src={demoGifPC} className={clsx(classes.introductionDemo)} />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Paper className={clsx(classes.introductionText)} elevation={3} square={false}>
                    <Typography variant="h5" component="h5">
                      Bucketify is a cloud music player.
                      <br />
                      This makes you can play your favorite music stored in{' '}
                      <strong>Amazon S3</strong> anytime, anywhere.
                      <br />
                      <br />
                      <strong>It is FREE TO USE</strong>. <br />
                      You have to pay only billing of your AWS accounts such as S3 storage or
                      Network transfer.
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Container>
          </Box>
        </ParallaxLayer>
        <ParallaxLayer offset={1.7} speed={1} factor={0.75}>
          <Box className={clsx(classes.buttonWrapper)}>
            <ResponsiveButton
              onClick={() => {
                if (parallaxRef !== null && parallaxRef.current !== null) {
                  parallaxRef.current.scrollTo(2);
                }
              }}
              variant="outlined"
              color="secondary"
            >
              How It Works?
            </ResponsiveButton>
          </Box>
        </ParallaxLayer>

        {/* HowItWorks */}
        <ParallaxLayer offset={2} speed={1.5}>
          <Box>
            <Box className={clsx(classes.howItWorksWrapperEdgeTop)}></Box>
            <Box className={clsx(classes.howItWorksWrapper)}>
              <Container maxWidth="lg" className={clsx(classes.sectionWrapper)}>
                <Typography variant="h3" component="h3" className={classes.sectionHeader}>
                  How It Works
                </Typography>
                <Box className={clsx(classes.howItWorksImageWrapper)}>
                  <img src={architecture} className={classes.howItWorksImage} />
                </Box>
                <Box className={clsx(classes.buttonWrapper)}>
                  <ResponsiveButton
                    onClick={() => {
                      if (parallaxRef !== null && parallaxRef.current !== null) {
                        parallaxRef.current.scrollTo(3);
                      }
                    }}
                    variant="outlined"
                    color="primary"
                  >
                    How To Use?
                  </ResponsiveButton>
                </Box>
              </Container>
            </Box>
          </Box>
          {/* <Box className={clsx(classes.howItWorksWrapperEdgeBottom)}></Box> */}
        </ParallaxLayer>

        <ParallaxLayer offset={3} speed={2}>
          <Box className={clsx(classes.defaultBackGroundWrapper)}>
            <Typography>Layers3 Third contents.</Typography>
          </Box>
        </ParallaxLayer>
        {/* 
        <ParallaxLayer offset={0} speed={0.5}>
          <span onClick={() => this.parallax.scrollTo(1)}>Layers can contain anything</span>
        </ParallaxLayer> */}
      </Parallax>

      {/* <Box>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        Under construction...
        <br />
        <br />
      </Box> */}
    </Box>
  );
};

export default Landing;
