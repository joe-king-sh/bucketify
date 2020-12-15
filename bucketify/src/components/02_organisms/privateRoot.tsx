import React, { useContext, Component } from 'react';
import { UserDataContext, IUserDataStateHooks } from '../../App';
import { Route, Redirect } from 'react-router-dom';
// import Login from "./Login";

export interface PrivateRouteProps {
  children: React.ReactNode;
  options: { exact: true; path: string };
}

// Redirect to signup page if user is not signed up.
const PrivateRoute: React.FC<PrivateRouteProps> = ({ options }) => {
  const UserDataHooks: IUserDataStateHooks = useContext(UserDataContext);
  return (
    <Route
      {...options}
      render={(props) =>
        UserDataHooks.user !== undefined ? <Component {...props} /> : <Redirect to="/signin" />
      }
    />
  );
};

export default PrivateRoute;
