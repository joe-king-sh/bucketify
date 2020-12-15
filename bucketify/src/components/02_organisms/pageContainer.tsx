import React from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';

import Container from '@material-ui/core/Container';

import MyTypographyH2 from '../01_atoms_and_molecules/myTypographyh2';
import MyTypographyH3 from '../01_atoms_and_molecules/myTypographyh3';

const useStyles = makeStyles(() =>
  createStyles({
    MyContainer: {
      margin: '2rem auto 2rem auto',
      maxWidth: '1100px',
    },
  })
);

export interface IPageContainerProps {
  h2Text?: string;
  h3Text?: string;
  children: React.ReactNode;
}
const PageContainer: React.FC<IPageContainerProps> = ({ h2Text, h3Text, children }) => {
  const classes = useStyles();

  return (
    <React.Fragment>
      <Container fixed className={classes.MyContainer}>
        {h2Text && <MyTypographyH2>{h2Text}</MyTypographyH2>}
        {h3Text && <MyTypographyH3>{h3Text}</MyTypographyH3>}

        {children}
      </Container>
    </React.Fragment>
  );
};

export default PageContainer;
