import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import { TAlert } from './alert';

const Alert = (props: AlertProps) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

export type TCustomizedSnackBar = {
  children?: React.ReactNode;
  alert: TAlert;
  isSnackBarOpen: boolean;
  handleClose: (
    event?: React.SyntheticEvent<Element, Event> | undefined,
    reason?: string | undefined
  ) => void;
};

export const CustomizedSnackBar: React.FC<TCustomizedSnackBar> = ({
  alert,
  isSnackBarOpen,
  handleClose,
}) => {
  return (
    <Snackbar open={isSnackBarOpen} onClose={handleClose}>
      <Alert onClose={handleClose} severity={alert.severity}>
        {alert.description}
      </Alert>
    </Snackbar>
  );
};
