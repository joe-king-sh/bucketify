import React, { useContext, useState, useEffect } from 'react';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import Collapse from '@material-ui/core/Collapse';

// Style
import clsx from 'clsx';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

// Router
import { Link } from 'react-router-dom';

// Icons
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import PersonAdd from '@material-ui/icons/PersonAdd';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Brightness7Icon from '@material-ui/icons/Brightness7';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import Language from '@material-ui/icons/Language';
import AccountCircle from '@material-ui/icons/AccountCircle';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import LibraryMusic from '@material-ui/icons/LibraryMusic';
import Search from '@material-ui/icons/Search';
import QueueMusic from '@material-ui/icons/QueueMusic';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import People from '@material-ui/icons/People';
import Album from '@material-ui/icons/Album';
import Audiotrack from '@material-ui/icons/Audiotrack';
import Settings from '@material-ui/icons/Settings';
import Share from '@material-ui/icons/Share';
import GitHub from '@material-ui/icons/GitHub';
import Twitter from '@material-ui/icons/Twitter';

// react-share
import { TwitterShareButton } from 'react-share';

// import i18next for translation.
import { useTranslation } from 'react-i18next';

// Context
import { AuthContext, IAuthStateHooks, LanguageContext } from '../../App';

// Authentification
import { AuthState } from '@aws-amplify/ui-components';
import { Auth } from 'aws-amplify';

// MyComponents
import { CustomizedSnackBar } from './snackBar';

// Constant setting
const drawerWidth = 240;

// Make custom styles
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    toolbarIcon: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: '0 8px',
      ...theme.mixins.toolbar,
    },
    menuButton: {
      marginRight: 36,
    },
    menuButtonHidden: {
      display: 'none',
    },

    pageTitle: {
      marginBottom: theme.spacing(1),
    },
    drawerPaper: {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerPaperClose: {
      overflowX: 'hidden',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: 0,
      // [theme.breakpoints.up("sm")]: {
      //   width: theme.spacing(9),
      // },
    },
    link: {
      textDecoration: 'none',
      color: theme.palette.text.primary,
    },

    nested: {
      paddingLeft: theme.spacing(4),
    },
  })
);

export interface MyDrawerProps {
  isDrawerOpen: boolean;
  handleDrawerClose: () => void;
  isDarkMode: boolean;
  handleDarkModeToggle: (isDarkMode: boolean) => void;
}

export const MyDrawer: React.FC<MyDrawerProps> = ({
  isDrawerOpen,
  handleDrawerClose,
  isDarkMode,
  handleDarkModeToggle,
}) => {
  // TranslationSetting
  const LanguageContextHooks = useContext(LanguageContext);
  const [t, i18n] = useTranslation();
  useEffect(() => {
    i18n.changeLanguage(LanguageContextHooks.languageState);
  }, [LanguageContextHooks.languageState, i18n]);

  // Styles
  const classes = useStyles();
  const theme = useTheme();
  const isMatchesOverMd = useMediaQuery(theme.breakpoints.up('md'));

  // Authentification
  const AuthStateHooks: IAuthStateHooks = useContext(AuthContext);
  // const UserDataHooks: IUserDataStateHooks = useContext(UserDataContext);

  // Collapse library menu settings.
  const [isLibraryOpen, setLibraryOpen] = React.useState(false);
  const handleLibraryOpen = () => {
    setLibraryOpen(!isLibraryOpen);
  };

  // Collapse Setting menu settings.
  const [isSettingOpen, setSettingOpen] = React.useState(false);
  const handleSettingOpen = () => {
    setSettingOpen(!isSettingOpen);
  };

  // Collapse SNS menu settings.
  const [isSNSOpen, setSNSOpen] = React.useState(false);
  const handleSNSOpen = () => {
    setSNSOpen(!isSNSOpen);
  };

  // Snack bar to notify under construction page.
  const [showSnackBar, setShowSnackBar] = useState(false);

  return (
    <>
      <Drawer
        variant={
          isMatchesOverMd && AuthStateHooks.authState === AuthState.SignedIn
            ? 'permanent'
            : 'temporary'
        }
        classes={{
          paper: clsx(
            classes.drawerPaper,
            // This drawer must be showned when width higher than md and signed in.
            !isDrawerOpen &&
              !(isMatchesOverMd && AuthStateHooks.authState === AuthState.SignedIn) &&
              classes.drawerPaperClose
          ),
        }}
        open={isDrawerOpen || (isMatchesOverMd && AuthStateHooks.authState === AuthState.SignedIn)}
      >
        {
          //Show "<" Icon only when width lower than md, because this drawer is always shown in widescreen.
          !isMatchesOverMd && (
            <div className={classes.toolbarIcon}>
              <IconButton onClick={handleDrawerClose}>
                <ChevronLeftIcon />
              </IconButton>
            </div>
          )
        }
        <Divider />
        <List>
          {AuthStateHooks.authState === AuthState.SignedIn ? (
            // When authorized.
            <>
              <Link to="/accounts" className={classes.link} onClick={() => handleDrawerClose()}>
                <ListItem button>
                  <ListItemIcon>
                    <AccountCircle />
                  </ListItemIcon>
                  <ListItemText primary={t('Account')} />
                </ListItem>
              </Link>
              <Link to="/bucket" className={classes.link} onClick={() => handleDrawerClose()}>
                <ListItem button>
                  <ListItemIcon>
                    <Search />
                  </ListItemIcon>
                  <ListItemText primary={t('ScanBucket')} />
                </ListItem>
              </Link>

              <ListItem button onClick={handleLibraryOpen}>
                <ListItemIcon>
                  <LibraryMusic />
                </ListItemIcon>
                <ListItemText primary={t('Library')} />
                {isLibraryOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItem>

              <Collapse in={isLibraryOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItem button className={classes.nested} onClick={() => setShowSnackBar(true)}>
                    <ListItemIcon>
                      <People />
                    </ListItemIcon>
                    <ListItemText primary={t('Artists')} />
                  </ListItem>

                  <ListItem button className={classes.nested} onClick={() => setShowSnackBar(true)}>
                    <ListItemIcon>
                      <Album />
                    </ListItemIcon>
                    <ListItemText primary={t('Albums')} />
                  </ListItem>

                  <Link to="/track" className={classes.link} onClick={() => handleDrawerClose()}>
                    <ListItem button className={classes.nested}>
                      <ListItemIcon>
                        <Audiotrack />
                      </ListItemIcon>
                      <ListItemText primary={t('Tracks')} />
                    </ListItem>
                  </Link>
                </List>
              </Collapse>

              {/* <Link to="/" className={classes.link}> */}
              <ListItem button onClick={() => setShowSnackBar(true)}>
                <ListItemIcon>
                  <QueueMusic />
                </ListItemIcon>
                <ListItemText primary={t('PlayList')} />
              </ListItem>
              {/* </Link> */}
            </>
          ) : (
            // When not authorized.
            <>
              {/* Sign in button links to login require pages. */}
              <Link to="/accounts" className={classes.link} onClick={() => handleDrawerClose()}>
                <ListItem button>
                  <ListItemIcon>
                    <Icon className="fa fa-sign-in-alt small" />
                  </ListItemIcon>
                  <ListItemText primary={t('SignIn')} />
                </ListItem>
              </Link>
              <Link to="/signup" className={classes.link} onClick={() => handleDrawerClose()}>
                <ListItem button>
                  <ListItemIcon>
                    <PersonAdd />
                  </ListItemIcon>
                  <ListItemText primary={t('SignUp')} />
                </ListItem>
              </Link>
            </>
          )}

          {/* ----------- Setting ----------- */}
          <ListItem button onClick={handleSettingOpen}>
            <ListItemIcon>
              <Settings />
            </ListItemIcon>
            <ListItemText primary={t('Setting')} />
            {isSettingOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItem>

          <Collapse in={isSettingOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem
                button
                className={classes.nested}
                onClick={() =>
                  LanguageContextHooks.toggleLanguage(LanguageContextHooks.languageState)
                }
              >
                <ListItemIcon>
                  <Language />
                </ListItemIcon>
                <ListItemText primary={t('Language')} />
              </ListItem>

              <ListItem
                button
                onClick={() => handleDarkModeToggle(isDarkMode)}
                className={classes.nested}
              >
                <ListItemIcon>
                  {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                </ListItemIcon>
                <ListItemText primary={t('Contrast')} />
              </ListItem>
            </List>
          </Collapse>

          {/* ----------- SNS ----------- */}
          <ListItem button onClick={handleSNSOpen}>
            <ListItemIcon>
              <Share />
            </ListItemIcon>
            <ListItemText primary={t('SNS')} />
            {isSNSOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={isSNSOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding onClick={() => setShowSnackBar(true)}>
              <a
                href="https://github.com/joe-king-sh/bucketify"
                className={classes.link}
                target="_blank"
              >
                <ListItem button className={classes.nested}>
                  <ListItemIcon>
                    <GitHub />
                  </ListItemIcon>
                  <ListItemText primary={t('GitHub')} />
                </ListItem>
              </a>

              <TwitterShareButton title="Bucketify" url={'https://www.bucketify.net/'}>
                <ListItem button className={classes.nested}>
                  <ListItemIcon>
                    <Twitter />
                  </ListItemIcon>
                  <ListItemText primary={t('Twitter')} />
                </ListItem>
              </TwitterShareButton>
            </List>
          </Collapse>

          {AuthStateHooks.authState === AuthState.SignedIn && (
            <>
              <Divider />
              <ListItem button onClick={() => Auth.signOut()}>
                <ListItemIcon>
                  {/* <IconButton className={clsx(classes.iconButtonLink)} > */}
                  <ExitToAppIcon />
                  {/* </IconButton> */}
                  {/* <Icon className="small fab fa-bitbucket" /> */}
                </ListItemIcon>
                <ListItemText primary={t('SignOut')} />
              </ListItem>
            </>
          )}
        </List>
      </Drawer>

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
