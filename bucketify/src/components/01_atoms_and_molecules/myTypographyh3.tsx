import React from 'react';
import { Typography } from '@material-ui/core';

import { makeStyles, createStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() =>
  createStyles({
    typoGraphy3: {
      paddingBottom: '1.5rem',
    },
  })
);

export interface IMyTypographyH3 {
  children: React.ReactNode;
}

const MyTypographyH3: React.FC<IMyTypographyH3> = ({ children }) => {
  const classes = useStyles();

  return (
    <Typography variant="h5" component="h3" className={classes.typoGraphy3}>
      {children}
    </Typography>
  );
};

export default MyTypographyH3;
