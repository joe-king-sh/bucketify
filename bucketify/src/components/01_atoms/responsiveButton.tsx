import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        responsiveButton: {
            [theme.breakpoints.down("sm")]: {
                width: '100%',
            },
            color: 'white',
        },
    }),
);

export interface IResponsiveButton {
    children: React.ReactNode;
}

const ResponsiveButton: React.FC<IResponsiveButton> = ({
    children
}) => {

    const classes = useStyles();


    return (
        <Button variant="contained" color="secondary" className={classes.responsiveButton}>
            {children}
        </Button>
    )
}

export default ResponsiveButton


