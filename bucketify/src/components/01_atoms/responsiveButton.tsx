import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        responsiveButton: {
            [theme.breakpoints.down("xs")]: {
                width: '100%',
            },
            color: 'white',
        },
    }),
);

export interface IResponsiveButton {
    children: React.ReactNode;
    onClick: () => void;
}

const ResponsiveButton: React.FC<IResponsiveButton> = ({
    children
    , onClick
}) => {

    const classes = useStyles();


    return (
        <Button variant="contained" color="secondary" className={classes.responsiveButton} onClick={onClick}>
            {children}
        </Button>
    )
}

export default ResponsiveButton


