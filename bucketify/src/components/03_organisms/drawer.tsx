import React from 'react';
import { Link } from "react-router-dom";
import Drawer from "@material-ui/core/Drawer";

import clsx from "clsx";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";

import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";

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

  return (
    <Drawer
      variant="permanent"
      classes={{
        paper: clsx(classes.drawerPaper, !isDrawerOpen && classes.drawerPaperClose),
      }}
      open={isDrawerOpen}
    >
      <div className={classes.toolbarIcon}>
        <IconButton onClick={handleDrawerClose}>
          <ChevronLeftIcon />
        </IconButton>
      </div>
      <Divider />
      <List>
        <Link to="/" className={classes.link}>
          <ListItem button>
            <ListItemIcon>
              <Icon className="fa fa-sign-in-alt small" />
            </ListItemIcon>
            <ListItemText primary="Sign In" />
          </ListItem>
        </Link>
        <Link to="/" className={classes.link}>
          <ListItem button>
            <ListItemIcon>
              <PersonAdd />

            </ListItemIcon>
            <ListItemText primary="Sign Up" />
          </ListItem>
        </Link>
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
  );
};
