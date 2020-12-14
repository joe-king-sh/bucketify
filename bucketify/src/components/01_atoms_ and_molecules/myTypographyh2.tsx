import React from 'react';
import { Typography } from '@material-ui/core';
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        typoGraphy2: {
            paddingBottom: '2.5rem',
        }

    })
);

export interface IMyTypographyH2 {
    children: React.ReactNode;
}

const MyTypographyH2: React.FC<IMyTypographyH2> = ({
    children,
}) => {

    const classes = useStyles();

    return (
        <React.Fragment>
            <Typography variant="h3" component="h2" className={classes.typoGraphy2}>
                {children}
            </Typography>
        </React.Fragment>
    )
}
                
export default MyTypographyH2
