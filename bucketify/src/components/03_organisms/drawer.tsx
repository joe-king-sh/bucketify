import React, { useContext } from 'react';
import { Link } from "react-router-dom";
import Drawer from "@material-ui/core/Drawer";

import clsx from "clsx";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";

import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";

// Icons
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";
import PersonAdd from "@material-ui/icons/PersonAdd";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Brightness7Icon from "@material-ui/icons/Brightness7";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import Language from "@material-ui/icons/Language";
import AccountCircle from "@material-ui/icons/AccountCircle";

import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

// Authorization
import {
  AuthContext,
} from '../../App'
import { AuthState } from '@aws-amplify/ui-components';

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({

    toolbarIcon: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      padding: "0 8px",
      ...theme.mixins.toolbar,
    },
    menuButton: {
      marginRight: 36,
    },
    menuButtonHidden: {
      display: "none",
    },

    pageTitle: {
      marginBottom: theme.spacing(1),
    },
    drawerPaper: {
      position: "relative",
      whiteSpace: "nowrap",
      width: drawerWidth,
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerPaperClose: {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: 0,
      // [theme.breakpoints.up("sm")]: {
      //   width: theme.spacing(9),
      // },
    },
    link: {
      textDecoration: "none",
      color: theme.palette.text.secondary,
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
  const AuthStateHooks = useContext(AuthContext);
  const matches = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <React.Fragment>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(
            classes.drawerPaper,
            // Drawer must be shown when width higher than md and signedin. 
            (!isDrawerOpen && !(matches && AuthStateHooks.authState === AuthState.SignedIn)) && classes.drawerPaperClose),
        }}
        open={isDrawerOpen || (matches && AuthStateHooks.authState === AuthState.SignedIn)}
      >
        
        {
        //Show "<" Icon only when width lower than md, because the drawer is always shown in widescreen.
        !matches &&
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>        
        }
        <Divider />
        <List>
          {
            AuthStateHooks.authState === AuthState.SignedIn ? (
              <React.Fragment>
              <Link to="/accounts" className={classes.link}>
                <ListItem button>
                  <ListItemIcon>
                    <AccountCircle />
                  </ListItemIcon>
                  <ListItemText primary="Account" />
                </ListItem>
              </Link>
              <Link to="/buckets" className={classes.link}>
                <ListItem button>
                  <ListItemIcon>
                    <Icon className="small fab fa-bitbucket" />
                  </ListItemIcon>
                  <ListItemText primary="MyBuckets" />
                </ListItem>
              </Link>


              </React.Fragment>
            ) : (
                <React.Fragment>
                  <Link to="/signin" className={classes.link}>
                    <ListItem button>
                      <ListItemIcon>
                        <Icon className="fa fa-sign-in-alt small" />
                      </ListItemIcon>
                      <ListItemText primary="Sign In" />
                    </ListItem>
                  </Link>
                  <Link to="/signup" className={classes.link}>
                    <ListItem button>
                      <ListItemIcon>
                        <PersonAdd />

                      </ListItemIcon>
                      <ListItemText primary="Sign Up" />
                    </ListItem>
                  </Link>
                </React.Fragment>

              )
          }
          <Divider />
          <Link to="/" className={classes.link}>
            <ListItem button>
              <ListItemIcon>

                <Language />
              </ListItemIcon>
              <ListItemText primary="Language" />
            </ListItem>
          </Link>
          <Link to="/" className={classes.link}>

            <ListItem button onClick={() => handleDarkModeToggle(isDarkMode)}>
              <ListItemIcon >
                {isDarkMode ? (
                  <Brightness7Icon />
                ) : (
                    <Brightness4Icon />
                  )}
              </ListItemIcon>
              <ListItemText primary="Contrast" />
            </ListItem>
          </Link>

        </List>
      </Drawer>
    </React.Fragment>
  );
};
