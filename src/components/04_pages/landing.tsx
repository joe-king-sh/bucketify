import React, { useRef } from 'react';
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
import bucketifyLogo from '../../images/bucketify_logo.png';
import amazonS3Logo from '../../images/amazon-s3-960x504.png';

// MyComponents
import ResponsiveButton from '../01_atoms_and_molecules/responsiveButton';

// Material-ui
import Grid from '@material-ui/core/Grid';
import { autoShowTooltip } from 'aws-amplify';

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
    buttonLearnMore: {
      textAlign: 'center',
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
    demoWrapper: {
      backgroundColor: '#805E73',
      // height: '75%',
    },
    introductionWrapper: {
      backgroundColor: theme.palette.background.default,
    },
    introductionImage: {
      width: '90%',
      margin: 'auto',
      display: 'inline-block',
    },
    introductionText: {
      padding: '1.75rem 1.5rem 1.75rem 1.5rem',
    },
    howToUseWrapper: {
      backgroundColor: '#805E73',
      // height: '75%',
    },
  })
);
const Landing: React.FC = () => {
  const classes = useStyles();
  const parallaxRef = useRef<Parallax>(null);
  // const theme = useTheme();
  // const isMatchesOverMd = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <Box>
      {/* https://www.react-spring.io/docs/props/parallax */}

      <Parallax pages={3} ref={parallaxRef}>
        <ParallaxLayer offset={0} speed={0} factor={1.3}>
          <Box className={clsx(classes.landingTopWrapper)}></Box>
        </ParallaxLayer>
        <ParallaxLayer offset={0.25} speed={1} factor={1}>
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
        <ParallaxLayer offset={0.7} speed={1} factor={1}>
          <Box className={clsx(classes.buttonLearnMore)}>
            <ResponsiveButton
              onClick={() => {
                if (parallaxRef !== null && parallaxRef.current !== null) {
                  parallaxRef.current.scrollTo(1);
                }
              }}
            >
              Learn More
            </ResponsiveButton>
          </Box>
        </ParallaxLayer>
        {/* Introduction */}
        <ParallaxLayer offset={1} speed={1.25} factor={1}>
          <Box className={clsx(classes.introductionWrapper)}>
            {/* <Box className={clsx(classes.sectionWrapper)}> */}
            <Container maxWidth="lg" className={clsx(classes.sectionWrapper)}>
              <Typography variant="h3" component="h3" className={classes.sectionHeader}>
                Introduction
              </Typography>

              <Grid container spacing={3} alignItems="center" justify="center">
                <Grid item xs={12} sm={6}>
                  <Box className={clsx(classes.introductionImage)}>
                    <img src={bucketifyLogo} className={clsx(classes.introductionImage)} />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Paper className={clsx(classes.introductionText)} elevation={3} square={false}>
                    <Typography variant="h5" component="h5">
                      Bucketify is a cloud music player.
                      <br />
                      This makes you can play your favorite music stored in Amazon S3, anytime,
                      anywhere.
                      <br />
                      <br />
                      It is free to use. <br />
                      You have to pay only billing of your AWS accounts such as S3 storage or
                      Network transfer.
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
              {/* </Box> */}
            </Container>
          </Box>
        </ParallaxLayer>
        <ParallaxLayer offset={2} speed={2} factor={1}>
          <Box className={clsx(classes.demoWrapper)}>
            <Typography>Layers3 Second contents.</Typography>
          </Box>
        </ParallaxLayer>
        {/* <ParallaxLayer offset={2} speed={0.4} factor={1}>
          <Box className={clsx(classes.introductionWrapper)}>
            <Typography>Layers3 Third contents.</Typography>
          </Box>
        </ParallaxLayer> */}
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
