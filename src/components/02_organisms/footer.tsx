import React from 'react';
import Typography from '@material-ui/core/Typography';
// import { Link } from 'react-router-dom';
import Box from '@material-ui/core/Box';
// import useMediaQuery from '@material-ui/core/useMediaQuery';

import { Author } from '../../common/const';

import clsx from 'clsx';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    footer: {
      backgroundColor: theme.palette.primary.main,
      // minHeight: theme.spacing(6),
      // [theme.breakpoints.down('md')]: {
      //   minHeight: theme.spacing(3),
      zIndex: 100,
      // },
      color: 'white',
    },
    linkTextSecondary: {
      color: theme.palette.secondary.main,
    },
    linkTextPrimary: {
      color: theme.palette.text.primary,
    },
  })
);

export const Footer: React.FC = () => {
  const classes = useStyles();

  return (
    <Box className={clsx(classes.footer)}>
      <Typography variant="body2" color="initial" align="center">
        {'© '}
        {new Date().getFullYear()}
        {' Copyright  '}
        <a href="https://twitter.com/joe_king_sh" className={clsx(classes.linkTextSecondary)}>
          {Author}
        </a>
        {'.'}
      </Typography>
      {/* <Typography variant="body2" color="textPrimary" align="center">
        <Link to="/privacy" className={clsx(classes.linkTextPrimary)}>
          Privacy Policy
        </Link>
      </Typography> */}
    </Box>
  );
};
