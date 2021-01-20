import React, { useContext, useState } from 'react';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import Collapse from '@material-ui/core/Collapse';

// Style
import clsx from 'clsx';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

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

import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

// Authorization
import {
  AuthContext,
  IAuthStateHooks,
  // UserDataContext,
  // IUserDataStateHooks,
} from '../../App';
import { AuthState } from '@aws-amplify/ui-components';
import { Auth } from 'aws-amplify';

// Common
import { msgUnderConstruction } from '../../common/message';

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
  const classes = useStyles();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('md'));
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
        variant="permanent"
        classes={{
          paper: clsx(
            classes.drawerPaper,
            // This drawer must be showned when width higher than md and signed in.
            !isDrawerOpen &&
              !(matches && AuthStateHooks.authState === AuthState.SignedIn) &&
              classes.drawerPaperClose
          ),
        }}
        open={isDrawerOpen || (matches && AuthStateHooks.authState === AuthState.SignedIn)}
      >
        {
          //Show "<" Icon only when width lower than md, because this drawer is always shown in widescreen.
          !matches && (
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
              <Link to="/accounts" className={classes.link}>
                <ListItem button>
                  <ListItemIcon>
                    <AccountCircle />
                  </ListItemIcon>
                  <ListItemText primary="Account" />
                </ListItem>
              </Link>
              <Link to="/bucket" className={classes.link}>
                <ListItem button>
                  <ListItemIcon>
                    <Search />
                  </ListItemIcon>
                  <ListItemText primary="ScanBucket" />
                </ListItem>
              </Link>

              <ListItem button onClick={handleLibraryOpen}>
                <ListItemIcon>
                  <LibraryMusic />
                </ListItemIcon>
                <ListItemText primary="Library" />
                {isLibraryOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItem>

              <Collapse in={isLibraryOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItem button className={classes.nested} onClick={() => setShowSnackBar(true)}>
                    <ListItemIcon>
                      <People />
                    </ListItemIcon>
                    <ListItemText primary="Artists" />
                  </ListItem>

                  <ListItem button className={classes.nested} onClick={() => setShowSnackBar(true)}>
                    <ListItemIcon>
                      <Album />
                    </ListItemIcon>
                    <ListItemText primary="Albums" />
                  </ListItem>

                  <Link to="/track" className={classes.link}>
                    <ListItem button className={classes.nested}>
                      <ListItemIcon>
                        <Audiotrack />
                      </ListItemIcon>
                      <ListItemText primary="Tracks" />
                    </ListItem>
                  </Link>
                </List>
              </Collapse>

              {/* <Link to="/" className={classes.link}> */}
              <ListItem button onClick={() => setShowSnackBar(true)}>
                <ListItemIcon>
                  <QueueMusic />
                </ListItemIcon>
                <ListItemText primary="PlayList" />
              </ListItem>
              {/* </Link> */}
            </>
          ) : (
            // When not authorized.
            <>
              {/* Sign in button links to login require pages. */}
              <Link to="/accounts" className={classes.link}>
                <ListItem button>
                  <ListItemIcon>
                    <Icon className="fa fa-sign-in-alt small" />
                  </ListItemIcon>
                  <ListItemText primary="SignIn" />
                </ListItem>
              </Link>
              <Link to="/signup" className={classes.link}>
                <ListItem button>
                  <ListItemIcon>
                    <PersonAdd />
                  </ListItemIcon>
                  <ListItemText primary="SignUp" />
                </ListItem>
              </Link>
            </>
          )}

          {/* ----------- Setting ----------- */}
          <ListItem button onClick={handleSettingOpen}>
            <ListItemIcon>
              <Settings />
            </ListItemIcon>
            <ListItemText primary="Setting" />
            {isSettingOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItem>

          <Collapse in={isSettingOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <Link to="/" className={classes.link}>
                <ListItem button className={classes.nested}>
                  <ListItemIcon>
                    <Language />
                  </ListItemIcon>
                  <ListItemText primary="Language" />
                </ListItem>
              </Link>

              <ListItem
                button
                onClick={() => handleDarkModeToggle(isDarkMode)}
                className={classes.nested}
              >
                <ListItemIcon>
                  {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                </ListItemIcon>
                <ListItemText primary="Contrast" />
              </ListItem>
            </List>
          </Collapse>

          {/* ----------- SNS ----------- */}
          <ListItem button onClick={handleSNSOpen}>
            <ListItemIcon>
              <Share />
            </ListItemIcon>
            <ListItemText primary="SNS" />
            {isSNSOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={isSNSOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <Link to="/" className={classes.link}>
                <ListItem button className={classes.nested}>
                  <ListItemIcon>
                    <GitHub />
                  </ListItemIcon>
                  <ListItemText primary="GitHub" />
                </ListItem>
              </Link>

              <Link to="/" className={classes.link}>
                <ListItem button className={classes.nested}>
                  <ListItemIcon>
                    <Twitter />
                  </ListItemIcon>
                  <ListItemText primary="Twitter" />
                </ListItem>
              </Link>
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
                <ListItemText primary="SignOut" />
              </ListItem>
            </>
          )}
        </List>
      </Drawer>

      <CustomizedSnackBar
        alert={{
          severity: 'info',
          title: '',
          description: msgUnderConstruction(),
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
