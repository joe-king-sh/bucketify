import React, { useRef, useContext, useEffect } from 'react';
import { AuthState } from '@aws-amplify/ui-components';

import Box from '@material-ui/core/Box';

// Style
import clsx from 'clsx';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

// react-spring
import { Parallax, ParallaxLayer } from 'react-spring/renderprops-addons';
import { useSpring, animated } from 'react-spring';

// Material-ui
import {
  Container,
  Paper,
  Step,
  Stepper,
  StepLabel,
  StepContent,
  Typography,
  Button,
  Link,
  ListItem,
  ListItemIcon,
  List,
  ListItemText,
} from '@material-ui/core';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import LibraryMusicIcon from '@material-ui/icons/LibraryMusic';
import QueueMusicIcon from '@material-ui/icons/QueueMusic';

// Image
import demoGifPC from '../../images/bucketify_demo_pc.gif';
import architecture from '../../images/architecture.drawio.svg';
import scanBucketImage from '../../images/scan-bucket-image.png';

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
      backgroundImage: 'url("images/bg-landing-resized.jpg")',
      backgroundSize: 'cover',
      height: '100%',
      backgroundPosition: '50% 50%',
    },
    landingMiddleParallaxLayer: {
      zIndex: -2,
    },
    landingMiddleWrapper: {
      backgroundImage: 'url("images/bg-landing5.jpg")',
      backgroundSize: 'cover',
      width: '100%',
      height: '100%',
      backgroundPosition: '50% 50%',
    },

    topWrapperCatchCopy: {
      color: 'white',
      textShadow: '1px 2px 3px #4b4b4b',
      fontFamily: 'Oswald',
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
      whiteSpace: 'pre-wrap',
    },
    introductionDemoWrapper: {
      textAlign: 'center',
    },
    introductionDemo: {
      width: '95%',
      borderRadius: '7px',
    },
    paperPadding: {
      padding: '1.75rem 1.5rem 1.75rem 1.5rem',
    },
    introductionFeaturesList: {
      backgroundColor: theme.palette.background.paper,
    },
    transParentBackground: {
      backgroundColor: 'transparent',
    },
    howItWorksWrapperEdgeTop: {
      paddingBottom: 'calc(10vw + 10px)',
      position: 'relative',
      overflow: 'hidden',
      zIndex: 5,
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
      zIndex: 5,
    },
    howItWorksText: {
      paddingBottom: theme.spacing(3),
    },
    howItWorksWrapperEdgeBottom: {
      paddingTop: 'calc(10vw)',
      position: 'relative',
      overflow: 'hidden',
      zIndex: 5,
      '&::before': {
        content: '""',
        position: 'absolute',
        bottom: '0',
        left: '0',
        borderTop: '10vw solid ' + theme.palette.secondary.main,
        borderRight: '100vw solid transparent',
      },
    },
    howItWorksImageWrapper: {
      textAlign: 'center',
      margin: 'auto',
    },
    threeDirectionCard: {
      width: '80%',
      height: 'auto',
      background: '#f0f8ff',
      borderRadius: '10px',
      boxShadow: '0px 10px 30px -5px rgba(0, 0, 0, 0.3)',
      transition: 'box-shadow 0.5s',
      willChange: 'transform',
      border: '15px solid #FFC045',
      margin: 'auto',
      '&:hover': {
        boxShadow: '0px 30px 100px -10px rgba(0, 0, 0, 0.4)',
      },
    },
    howItWorksImage: {
      width: '100%',
      backgroundColor: '#f0f8ff',
      padding: '20px',
      borderRadius: '10px',
    },

    howToUseWrapper: {
      // backgroundColor: '#f0f8ff',
      // height: '75%',
    },
    howToUseCodeBlock: {
      margin: theme.spacing(2),
      padding: theme.spacing(3),
      backgroundColor: '#f0f8ff',
      color: theme.palette.primary.main,
    },
    howToUseImage: {
      margin: theme.spacing(2),
      width: '80%',
      borderRadius: theme.spacing(2),
      boxShadow: '0px 10px 30px -5px rgba(0, 0, 0, 0.3)',
    },
    button: {
      marginTop: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    actionsContainer: {
      marginBottom: theme.spacing(2),
    },
    resetContainer: {
      padding: theme.spacing(3),
    },
    linkText: {
      color: theme.palette.secondary.main,
    },
    stepperSpacert: {
      marginBottom: theme.spacing(4),
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

  const theme = useTheme();
  const isMatchesDownSm = useMediaQuery(theme.breakpoints.down('sm'));

  // State
  const [activeStep, setActiveStep] = React.useState(0);

  // Effect when hover on 3d card.
  const calc = (x: number, y: number): number[] => [
    -(y - window.innerHeight / 2) / 90, // degree
    (x - window.innerWidth / 2) / 90, // degree
    1.05, // expand rate
  ];
  const trans = (x: number, y: number, s: number): string =>
    `perspective(600px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`;

  const [props, setSpringImage] = useSpring(() => ({
    xys: [0, 0, 1],
    config: { mass: 5, tension: 350, friction: 40 },
  }));

  //How To Use StepperContent
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const handleReset = () => {
    setActiveStep(0);
  };
  const corsPolicy = `[
  {
      "AllowedHeaders": [
          "*"
      ],
      "AllowedMethods": [
          "GET"
      ],
      "AllowedOrigins": [
          "https://www.bucketify.net"
      ],
      "ExposeHeaders": []
  }
]`;
  const iamPolicy = `{
  "Version": "2012-10-17",
  "Statement": [
      {
          "Sid": "VisualEditor0",
          "Effect": "Allow",
          "Action": [
              "s3:ListBucket",
              "s3:ListBucketVersions",
              "s3:GetObject"
          ],
          "Resource": [
              "arn:aws:s3:::<Your bucket name>",
              "arn:aws:s3:::<Your bucket name>/*"
          ]
      }
  ]
}
`;
  const steps = [
    'Create Your AWS account',
    'Create your S3 bucket',
    'Create IAM user',
    'SignUp and SignIn to Bucketify',
    'Scan your bucket',
  ];

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <>
            If you don't have own aws accounts, please create from&nbsp;
            <Link
              href="https://portal.aws.amazon.com/billing/signup#/start"
              target="_blank"
              className={clsx(classes.linkText)}
            >
              HERE
            </Link>
            .
          </>
        );
      case 1:
        return (
          <>
            If you don't have S3 bucket, create bucket to store your audio files from&nbsp;
            <Link
              href="https://s3.console.aws.amazon.com/s3/home"
              target="_blank"
              className={clsx(classes.linkText)}
            >
              AWS Management Console
            </Link>
            .<br />
            You have to turn of the all <strong>Block public access (bucket settings)</strong>, and
            Add <strong>Cross-origin resource sharing (CORS)</strong> settings <br />
            <br />
            Like below:
            <br />
            <Paper elevation={3} className={clsx(classes.howToUseCodeBlock)}>
              {corsPolicy}
            </Paper>
          </>
        );
      case 2:
        return (
          <>
            Create IAM User and attach a policy to be able to access your bucket. <br />
            <br />
            Like below:
            <br />
            <Paper elevation={3} className={clsx(classes.howToUseCodeBlock)}>
              {' '}
              {iamPolicy}
            </Paper>
          </>
        );
      case 3:
        return (
          <>
            You can use a social accounts to sign up Bucketify such as Google, Facebook, Amazon.
            <br />
            If you create own account ,sign up bucketify from&nbsp;
            <Link
              href="https://www.bucketify.net/accounts"
              target="_blank"
              className={clsx(classes.linkText)}
            >
              HERE
            </Link>
            .<br />
          </>
        );
      case 4:
        return (
          <>
            Enter your bucket name, access key, and secret access key, and Hit a Scan Bucket button.
            <br />
            <img src={scanBucketImage} className={clsx(classes.howToUseImage)} />
          </>
        );
      default:
        return <>'Unknown step'</>;
    }
  };

  return (
    <Box>
      {/* https://www.react-spring.io/docs/props/parallax */}

      <Parallax pages={!isMatchesDownSm ? 5.33 : 5.33 + 2.3} ref={parallaxRef}>
        {/* Top Wrapper */}
        <ParallaxLayer offset={0} speed={0} factor={1.25}>
          <Box className={clsx(classes.landingTopWrapper)}></Box>
        </ParallaxLayer>
        <ParallaxLayer offset={0.25} speed={0.75}>
          <Typography
            variant="h1"
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
                  <Paper className={clsx(classes.paperPadding)} elevation={3} square={false}>
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
                <Grid item xs={12}>
                  <Typography variant="h4" className={classes.sectionHeader}>
                    Features
                  </Typography>
                  <div>
                    <List className={clsx(classes.introductionFeaturesList)}>
                      <ListItem>
                        <ListItemIcon>
                          <CloudDownloadIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary="Streaming playback"
                          secondary={`Makes you can streaming playback your favorite music in s3 bucket. 
It is also can mobile background playing.`}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <LibraryMusicIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary="Auto generated libraries"
                          secondary={`Generates libraries by tracks, artist(🚧), album(🚧).
Allowed file extensions are only "mp3" or "m4a".`}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <QueueMusicIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary="Playlists stored on the cloud(🚧)"
                          secondary={`Makes you can store playlists on the cloud, and play on any device, anytime, anywhere.`}
                        />
                      </ListItem>
                    </List>
                  </div>
                </Grid>
                <Grid item xs={12}>
                  <Box className={clsx(classes.buttonWrapper)}>
                    <ResponsiveButton
                      onClick={() => {
                        if (parallaxRef !== null && parallaxRef.current !== null) {
                          parallaxRef.current.scrollTo(!isMatchesDownSm ? 2 : 2 + 1);
                        }
                      }}
                      variant="outlined"
                      color="secondary"
                    >
                      How It Works
                    </ResponsiveButton>
                  </Box>
                </Grid>
              </Grid>
            </Container>
          </Box>
        </ParallaxLayer>

        {/* How It Works */}
        <ParallaxLayer offset={!isMatchesDownSm ? 2 : 2 + 1} speed={0.5}>
          <Box className={clsx(classes.transParentBackground)}>
            <Box className={clsx(classes.howItWorksWrapperEdgeTop)}></Box>
            <Box className={clsx(classes.howItWorksWrapper)}>
              <Container maxWidth="lg" className={clsx(classes.sectionWrapper)}>
                <Typography variant="h3" component="h3" className={classes.sectionHeader}>
                  How It Works
                </Typography>
                <Typography variant="body1" className={clsx(classes.howItWorksText)}>
                  Bucketify manages only your audio file metadata.
                </Typography>
                <Box className={clsx(classes.howItWorksImageWrapper)}>
                  <animated.div
                    className={clsx(classes.threeDirectionCard)}
                    onMouseMove={({ clientX: x, clientY: y }) =>
                      setSpringImage({ xys: calc(x, y) })
                    }
                    onMouseLeave={() => setSpringImage({ xys: [0, 0, 1] })}
                    // @ts-ignore
                    style={{ transform: props.xys.interpolate(trans) }}
                  >
                    <img src={architecture} className={classes.howItWorksImage} />
                  </animated.div>
                </Box>
                <Box className={clsx(classes.buttonWrapper)}>
                  <ResponsiveButton
                    onClick={() => {
                      if (parallaxRef !== null && parallaxRef.current !== null) {
                        parallaxRef.current.scrollTo(!isMatchesDownSm ? 3 : 3 + 1);
                      }
                    }}
                    variant="outlined"
                    color="primary"
                  >
                    How To Use
                  </ResponsiveButton>
                </Box>
              </Container>
            </Box>
            <Box className={clsx(classes.howItWorksWrapperEdgeBottom)}></Box>
          </Box>
        </ParallaxLayer>

        {/* How to use */}
        <ParallaxLayer
          offset={!isMatchesDownSm ? 2.8 : 2.8 + 1}
          speed={0}
          factor={1.25}
          // @ts-ignore
          class={clsx(classes.landingMiddleParallaxLayer)}
        >
          <Box className={clsx(classes.landingMiddleWrapper)}></Box>
        </ParallaxLayer>
        <ParallaxLayer offset={!isMatchesDownSm ? 3 : 3 + 1} speed={3} factor={1}>
          <Box className={clsx(classes.defaultBackGroundWrapper)}>
            <Container
              maxWidth="lg"
              className={clsx(classes.sectionWrapper, classes.stepperSpacert)}
            >
              <Typography variant="h3" component="h3" className={classes.sectionHeader}>
                How To Use
              </Typography>

              <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map((label, index) => (
                  <Step key={label}>
                    <StepLabel
                      onClick={() => {
                        setActiveStep(index);
                      }}
                    >
                      <Typography variant="h5" component="h4">
                        {label}
                      </Typography>
                    </StepLabel>
                    <StepContent>
                      <Typography variant="body1" component="span">
                        {getStepContent(index)}
                      </Typography>
                      <div className={classes.actionsContainer}>
                        {/* <div> */}
                        <Button
                          disabled={activeStep === 0}
                          onClick={handleBack}
                          className={classes.button}
                        >
                          Back
                        </Button>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleNext}
                          className={classes.button}
                        >
                          {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                        </Button>
                      </div>
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
              {activeStep === steps.length && (
                <Paper square elevation={0} className={classes.resetContainer}>
                  <Typography>
                    You are ready to use Bucketify🎉 <br />
                    Enjoy!!
                  </Typography>
                  <Button onClick={handleReset} className={classes.button}>
                    Reset
                  </Button>
                </Paper>
              )}
            </Container>
          </Box>
        </ParallaxLayer>
        <ParallaxLayer offset={!isMatchesDownSm ? 4 : 4 + 1} speed={1.25} factor={1.5}>
          <Box className={clsx(classes.defaultBackGroundWrapper)}>
            <Container maxWidth="lg" className={clsx(classes.sectionWrapper)}>
              <Typography variant="h3" component="h3" className={classes.sectionHeader}>
                Privacy Policy
              </Typography>

              <Paper className={clsx(classes.paperPadding)}>
                <Typography variant="body1" component="div">
                  Last updated: 2020-01-30
                  <br />
                  <br />
                  We operates http://www.bucketify.net (the "Site"). This page informs you of our
                  policies regarding the collection, use and disclosure of Personal Information we
                  receive from users of the Site.
                  <br />
                  <br />
                  We use your Personal Information only for providing and improving the Site. By
                  using the Site, you agree to the collection and use of information in accordance
                  with this policy.
                </Typography>
                <br />
                <Typography variant="h5" component="h5">
                  Information Collection And Use
                </Typography>
                <br />
                <Typography variant="body1" component="div">
                  While using our Site, we may ask you to provide us with certain personally
                  identifiable information that can be used to contact or identify you. Personally
                  identifiable information may include, but is not limited to your name ("Personal
                  Information").
                </Typography>

                <br />
                <Typography variant="h5" component="h5">
                  Log Data
                </Typography>
                <br />
                <Typography variant="body1" component="div">
                  Like many site operators, we collect information that your browser sends whenever
                  you visit our Site ("Log Data").
                  <br />
                  <br />
                  This Log Data may include information such as your computer's Internet Protocol
                  ("IP") address, browser type, browser version, the pages of our Site that you
                  visit, the time and date of your visit, the time spent on those pages and other
                  statistics.
                  <br />
                  <br />
                  In addition, we may use third party services such as Google Analytics that
                  collect, monitor and analyze this …
                </Typography>

                <br />
                <Typography variant="h5" component="h5">
                  Communications
                </Typography>
                <br />
                <Typography variant="body1" component="div">
                  We may use your Personal Information to contact you with newsletters, marketing or
                  promotional materials and other information that ...
                </Typography>

                <br />
                <Typography variant="h5" component="h5">
                  Cookies
                </Typography>
                <br />
                <Typography variant="body1" component="div">
                  Cookies are files with small amount of data, which may include an anonymous unique
                  identifier. Cookies are sent to your browser from a web site and stored on your
                  computer's hard drive.
                  <br />
                  <br />
                  Like many sites, we use "cookies" to collect information. You can instruct your
                  browser to refuse all cookies or to indicate when a cookie is being sent. However,
                  if you do not accept cookies, you may not be able to use some portions of our
                  Site.
                </Typography>

                <br />
                <Typography variant="h5" component="h5">
                  Security
                </Typography>
                <br />
                <Typography variant="body1" component="div">
                  The security of your Personal Information is important to us, but remember that no
                  method of transmission over the Internet, or method of electronic storage, is 100%
                  secure. While we strive to use commercially acceptable means to protect your
                  Personal Information, we cannot guarantee its absolute security.
                </Typography>

                <br />
                <Typography variant="h5" component="h5">
                  Changes To This Privacy Policy
                </Typography>
                <br />
                <Typography variant="body1" component="div">
                  This Privacy Policy is effective as of (2020-01-30) and will remain in effect
                  except with respect to any changes in its provisions in the future, which will be
                  in effect immediately after being posted on this page.
                  <br />
                  <br />
                  We reserve the right to update or change our Privacy Policy at any time and you
                  should check this Privacy Policy periodically. Your continued use of the Service
                  after we post any modifications to the Privacy Policy on this page will constitute
                  your acknowledgment of the modifications and your consent to abide and be bound by
                  the modified Privacy Policy.
                  <br />
                  <br />
                  If we make any material changes to this Privacy Policy, we will notify you either
                  through the email address you have provided us, or by placing a prominent notice
                  on our website.
                  <br />
                </Typography>

                <br />
                <Typography variant="h5" component="h5">
                  Contact Us
                </Typography>
                <br />
                <Typography variant="body1" component="div">
                  If you have any questions about this Privacy Policy, please contact us.
                </Typography>
              </Paper>
            </Container>
          </Box>
        </ParallaxLayer>
      </Parallax>
    </Box>
  );
};

export default Landing;
