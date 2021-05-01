import React, { useContext, useEffect } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';

// Icons
import MenuIcon from '@material-ui/icons/Menu';
import Brightness7Icon from '@material-ui/icons/Brightness7';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import Language from '@material-ui/icons/Language';
import AccountCircle from '@material-ui/icons/AccountCircle';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import GitHub from '@material-ui/icons/GitHub';
import Twitter from '@material-ui/icons/Twitter';

// Share button
import { TwitterShareButton } from 'react-share';

// Auth
import { Auth } from 'aws-amplify';
import { AuthState } from '@aws-amplify/ui-components';

// Router
import { Link } from 'react-router-dom';
// import { useHistory } from "react-router-dom";

// style
import clsx from 'clsx';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

// Images
import logo from '../../images/bucketify_logo.png';

// Context
import { AuthContext, LanguageContext } from '../../App';

// Material-ui components
import { Typography } from '@material-ui/core';

// Translation
import { useTranslation } from 'react-i18next';

const drawerWidth = 240;

// Make custom styles.
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    logoWrapper: {
      margin: 'auto',
      justifyContent: 'center',
      paddingRight: '24px',
      // Make the logo image stick out.
      maxHeight: '4rem',

      [theme.breakpoints.up('md')]: {
        margin: '0',
      },
    },
    logo: {
      height: '3.1rem',
      lineHeight: '2.1rem',
      padding: '0 0 0 0',

      '& h1': {
        margin: 'auto',
        paddingTop: '0.25rem',
        [theme.breakpoints.down('sm')]: {
          paddingTop: '0.5rem',
        },
      },

      // Make the logo image stick out.
      [theme.breakpoints.up('md')]: {
        height: '5rem',
      },
    },

    toolbar: {
      paddingRight: 24,
      [theme.breakpoints.up('md')]: {
        paddingLeft: '0.5rem',
      },
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    // When drawer is open.
    appBarShift: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },

    menuButton: {
      // marginRight: 36,
    },
    menuButtonHidden: {
      display: 'none',
    },

    // Nav button is Show in PC only.
    buttonNav: {
      marginLeft: 'auto',
      [theme.breakpoints.down('sm')]: {
        display: 'none',
      },
      '& button': {
        margin: '0.25rem',
      },
    },

    // IconButton
    iconButtonLink: {
      color: 'white',
    },

    // Style for buttons contain Link.
    linkInButtonOutline: {
      color: 'white',
      textDecoration: 'none',
    },
    linkInButtonContaind: {
      textDecoration: 'none',
      color: 'black',
    },
  })
);

export interface MyAppBarProps {
  isDarkMode: boolean;
  isDrawerOpen: boolean;
  handleDarkModeToggle: (isDarkMode: boolean) => void;
  handleDrawerOpen: () => void;
}

export const MyAppBar: React.FC<MyAppBarProps> = ({
  isDarkMode,
  isDrawerOpen,
  handleDarkModeToggle,
  handleDrawerOpen,
}) => {
  const AuthStateHooks = useContext(AuthContext);
  const LanguageContextHooks = useContext(LanguageContext);

  const classes = useStyles();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('md'));

  // translation
  const [t, i18n] = useTranslation();
  useEffect(() => {
    i18n.changeLanguage(LanguageContextHooks.languageState);
  }, [LanguageContextHooks.languageState, i18n]);

  return (
    <AppBar
      position="absolute"
      className={clsx(
        classes.appBar,
        (isDrawerOpen || (AuthStateHooks.authState === AuthState.SignedIn && matches)) &&
          classes.appBarShift
      )}
    >
      <Toolbar className={classes.toolbar}>
        {/* Hamburger menu icon */}
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          onClick={() => handleDrawerOpen()}
          className={clsx(
            classes.menuButton,
            (isDrawerOpen || matches) && classes.menuButtonHidden
          )}
        >
          <MenuIcon />
        </IconButton>

        {/* Site logo */}
        <Box className={clsx(classes.logoWrapper)}>
          <Link to="/">
            <Typography variant="h1" component="h2" className={clsx(classes.logo)}>
              <img src={logo} alt="bucketify-logo" className={clsx(classes.logo)} />
            </Typography>
          </Link>
        </Box>

        {/* The navigation menu on the right side. */}
        <Box className={clsx(classes.buttonNav)}>
          {/* The button to select language. */}
          <Tooltip title={t('Choose language') as string}>
            <IconButton
              color="inherit"
              onClick={() =>
                LanguageContextHooks.toggleLanguage(LanguageContextHooks.languageState)
              }
            >
              <Language />
            </IconButton>
          </Tooltip>

          {/* The button to select contrast. */}
          <Tooltip title={t('Contrast') as string}>
            {isDarkMode ? (
              <IconButton
                color="inherit"
                onClick={() => handleDarkModeToggle(isDarkMode)}
                aria-label={t('Switch to Light mode')}
              >
                <Brightness7Icon />
              </IconButton>
            ) : (
              <IconButton
                color="inherit"
                onClick={() => handleDarkModeToggle(isDarkMode)}
                aria-label={t('Switch to Dark mode')}
              >
                <Brightness4Icon />
              </IconButton>
            )}
          </Tooltip>

          <IconButton color="inherit" aria-label={t('GitHub')}>
            <a
              href="https://github.com/joe-king-sh/bucketify"
              className={classes.linkInButtonOutline}
              target="_blank"
            >
              <Tooltip title={t('GitHub') as string}>
                <GitHub />
              </Tooltip>
            </a>
          </IconButton>
          <IconButton color="inherit" aria-label={t('Twitter')}>
            <TwitterShareButton title="Bucketify" url={'https://www.bucketify.net/'}>
              <Twitter />
            </TwitterShareButton>
          </IconButton>

          {AuthStateHooks.authState === AuthState.SignedIn ? (
            <React.Fragment>
              <Link to="/accounts">
                <Tooltip title={t('Account') as string}>
                  <IconButton className={clsx(classes.iconButtonLink)}>
                    <AccountCircle />
                  </IconButton>
                </Tooltip>
              </Link>
              <Tooltip title={t('SignOut') as string}>
                <IconButton className={clsx(classes.iconButtonLink)} onClick={() => Auth.signOut()}>
                  <ExitToAppIcon />
                </IconButton>
              </Tooltip>
            </React.Fragment>
          ) : (
            <React.Fragment>
              {/* Sign in button links to login require pages. */}
              <Button variant="outlined" color="secondary">
                <Link to="/accounts" className={clsx(classes.linkInButtonOutline)}>
                  {t('SignIn')}
                </Link>
              </Button>

              <Button variant="contained" color="secondary">
                <Link to="/signup" className={clsx(classes.linkInButtonContaind)}>
                  {t('SignUp')}
                </Link>
              </Button>
            </React.Fragment>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};
