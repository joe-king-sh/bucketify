import React, { ReactNode } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';

import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';

export type TAlert = {
  severity: 'error' | 'warning' | 'success' | 'info' | undefined;
  description: string;
  title: string;
};
export type TAlertFieldProps = {
  children?: ReactNode;
  alerts: TAlert[];
};

/**
 * Style
 */
const useStyles = makeStyles(() =>
  createStyles({
    alertField: {
      whiteSpace: 'pre-wrap',
    },
  })
);

const AlertField: React.FC<TAlertFieldProps> = ({ alerts }) => {
  const classes = useStyles();

  return (
    <>
      {alerts.map((alert, i) => {
        return (
          <Alert key={i} severity={alert.severity} className={classes.alertField}>
            <AlertTitle>{alert.title}</AlertTitle>
            <div
              dangerouslySetInnerHTML={{
                __html: alert.description,
              }}
            />
          </Alert>
        );
      })}
    </>
  );
};
export default AlertField;
