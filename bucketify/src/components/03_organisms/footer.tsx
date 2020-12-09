import React from 'react';
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";
import Box from "@material-ui/core/Box";

import { Author } from '../10_utilify/const'

import clsx from "clsx";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";


const useStyles = makeStyles((theme: Theme) =>
  createStyles({

    footer: {
      backgroundColor: theme.palette.primary.main,
      minHeight: '2rem',
    },
  })
);

export const Footer: React.FC = () => {
  const classes = useStyles();

  return (

    <Box className={clsx(classes.footer)}>
      <Typography variant="body2" color="textSecondary" align="center">
        {"© "}
        {new Date().getFullYear()}
        {" Copyright "}
        <Link color="inherit" to="/">
          {Author}
        </Link>
        {"."}
      </Typography>
    </Box>
  );
};
