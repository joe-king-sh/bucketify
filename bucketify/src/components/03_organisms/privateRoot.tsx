import React, { useContext, Component } from "react";
import { UserDataContext, IUserDataStateHooks } from "../../App";
import { Route, Redirect } from "react-router-dom";
// import Login from "./Login";

// Redirect to signup page if user is not signed up.
const PrivateRoute = ({ component, ...options }: { exact: true; path: string; component: React.FC<{}>; }) => {
    const UserDataHooks: IUserDataStateHooks = useContext(UserDataContext);
    return (
        <Route
            {...options}
            render={props =>
                UserDataHooks.user !== undefined ? (<Component {...props} />) : (<Redirect to="/signin" />)
            }
        />
    );
};

export default PrivateRoute;