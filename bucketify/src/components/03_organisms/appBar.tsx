import React from 'react';
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
// import Grid from "@material-ui/core/Grid";

// import Typography from "@material-ui/core/Typography";
import MenuIcon from "@material-ui/icons/Menu";
import Brightness7Icon from "@material-ui/icons/Brightness7";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import Language from "@material-ui/icons/Language";


import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

// style
import clsx from "clsx";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";


import logo from '../../images/bucketify_logo.png';


const drawerWidth = 240;

// Make custom styles.
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    logoWrapper: {
      margin: 'auto',
      justifyContent: 'center',
      paddingRight: '24px', // Menu button
      [theme.breakpoints.up("md")]: {
        margin: '0',
        '& img': {
          // height: '10vh',
        }
      },
    },
    logo: {
      height: '3.1rem',
      lineHeight: '2.1rem',
      padding: '0 0 0 0',

      '& h1': {
        // fontSize: '2rem',
        margin: 'auto',
        paddingTop: '0.25rem',

        // varticalAlign: 'center',

      }
    },

    toolbar: {
      paddingRight: 24,
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),

    },
    // When drawer is open.
    appBarShift: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },

    menuButton: {
      // marginRight: 36,

    },
    menuButtonHidden: {
      display: "none",
    },

    // Nav button is Show in PC only.
    buttonNav: {
      marginLeft: 'auto',
      [theme.breakpoints.down("sm")]: {
        display: 'none',
      },
      '& button': {
        margin: '0.25rem',
      }
    }

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

  const classes = useStyles();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <AppBar
      position="absolute"
      className={clsx(classes.appBar, isDrawerOpen && classes.appBarShift)}
    >
      <Toolbar className={classes.toolbar}>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          onClick={() => handleDrawerOpen()}
          className={
            clsx(
              classes.menuButton,

              (isDrawerOpen || matches) && classes.menuButtonHidden
            )}
        >
          <MenuIcon />
        </IconButton>
        <Box className={clsx(classes.logoWrapper)}>
          <a href="/" className={clsx(classes.logo)} >
            <h1>
              <img src={logo} alt="bucketify-logo" className={clsx(classes.logo)} />
            </h1>
          </a>
        </Box>


        <Box className={clsx(classes.buttonNav)}>

          <IconButton color="inherit"  >
            <Language />
          </IconButton>
          {
            isDarkMode ? (
              <IconButton color="inherit" onClick={() => handleDarkModeToggle(isDarkMode)} >
                <Brightness7Icon />
              </IconButton>
            ) : (
                <IconButton color="inherit" onClick={() => handleDarkModeToggle(isDarkMode)} >
                  <Brightness4Icon />
                </IconButton>
              )
          }


          <Button variant="outlined" color="secondary">
            Sign In
        </Button>
          <Button variant="contained" color="secondary">
            Sign Up
        </Button>
        </Box>

      </Toolbar>
    </AppBar>


  );
};