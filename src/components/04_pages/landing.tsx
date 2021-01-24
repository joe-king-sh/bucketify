import React, { useRef } from 'react';
import Box from '@material-ui/core/Box';

// Style
import clsx from 'clsx';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
// import { useTheme } from '@material-ui/core/styles';
// import useMediaQuery from '@material-ui/core/useMediaQuery';

// Parallax
import { Parallax, ParallaxLayer } from 'react-spring/renderprops-addons';
import { Paper, Typography } from '@material-ui/core';

// Image
import bucketifyLogo from '../../images/bucketify_logo.png';
import amazonS3Logo from '../../images/amazon-s3-960x504.png';

// MyComponents
import ResponsiveButton from '../01_atoms_and_molecules/responsiveButton';

//Styles
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    landingTopWrapper: {
      backgroundImage: 'url("images/bg-landing.jpg")',
      backgroundSize: 'cover',
      height: '100%',
      backgroundPosition: '50% 50%',
      [theme.breakpoints.down('lg')]: {
        backgroundImage: 'url("images/bg-landing-tablet.jpg")',
      },
      [theme.breakpoints.down('md')]: {
        backgroundImage: 'url("images/bg-landing-mobile.jpg")',
      },
    },
    topWrapperCatchCopy: {
      color: 'white',
      textShadow: '1px 2px 3px #4b4b4b',
    },
    topWrapperS3Image: {
      width: '30%',
      opacity: '0.95',
      margin: 'auto auto auto auto',
      display: 'inlinet-block',
    },
    demoWrapper: {
      backgroundColor: '#805E73',
      // height: '75%',
    },
    intoroductionWrapper: {
      backgroundColor: '#87BCDE',
      // height: '75%',
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
        <ParallaxLayer offset={0} speed={0} factor={1.25}>
          <Box className={clsx(classes.landingTopWrapper)}></Box>
        </ParallaxLayer>
        <ParallaxLayer offset={0.25} speed={1} factor={0.7}>
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
        <ParallaxLayer offset={1} speed={0.75} factor={1}>
          <Paper>
            <Typography>
              You can put your favorite music in Amazon S3 and play it from anywhere
            </Typography>
          </Paper>
        </ParallaxLayer>
        <ParallaxLayer offset={1} speed={0.75} factor={0.5}>
          <ResponsiveButton
            onClick={() => {
              if (parallaxRef !== null && parallaxRef.current !== null) {
                parallaxRef.current.scrollTo(1);
              }
            }}
          >
            Learn More
          </ResponsiveButton>
        </ParallaxLayer>

        <ParallaxLayer offset={1} speed={2} factor={1}>
          <Box className={clsx(classes.demoWrapper)}>
            <Typography>Layers2 Second contents.</Typography>
          </Box>
        </ParallaxLayer>
        <ParallaxLayer offset={2} speed={0.4} factor={1}>
          <Box className={clsx(classes.intoroductionWrapper)}>
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
