import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    responsiveButton: {
      [theme.breakpoints.down('xs')]: {
        width: '90%',
      },
      // color: 'white',
    },
  })
);

export interface IResponsiveButton {
  children: React.ReactNode;
  onClick: () => void;
  variant: 'text' | 'outlined' | 'contained';
  color: 'inherit' | 'default' | 'primary' | 'secondary' | undefined;
}

const ResponsiveButton: React.FC<IResponsiveButton> = ({ children, onClick, variant, color }) => {
  const classes = useStyles();

  return (
    <Button variant={variant} color={color} className={classes.responsiveButton} onClick={onClick}>
      {children}
    </Button>
  );
};

export default ResponsiveButton;
