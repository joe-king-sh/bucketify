import React from 'react';

// Routing
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
// Auth
import { AuthState } from '@aws-amplify/ui-components';

import Landing from './components/05_pages/landing';
import MyBuckets from './components/05_pages/myBuckets';
import GenericTemplate from './components/04_templates/genericTemplate';


// export type LoginContext = {
//   login: boolean,
//   setLogin: any
// }
// const defaultLoginContext: LoginContext = {
//   login: false,
//   setLogin: () => {}
// }

// Auth Status
export interface IAuthStateHooks {
  authState: any,
  setAuthState: any
}
const defaultAuthStateHooks: IAuthStateHooks = {
  authState: AuthState.SignOut,
  setAuthState: () => {}
}
export const AuthContext = React.createContext<IAuthStateHooks>(defaultAuthStateHooks);

// Cognito UserData
export interface IUserDataStateHooks {
  user: any,
  setUser: any
}
const defaultUserDataStateHooks = {
  user: undefined,
  setUser: undefined
}
export const UserDataContext = React.createContext<IUserDataStateHooks>(defaultUserDataStateHooks);



const App: React.FC = () => {

  // const [login, setLogin] = React.useState(false);
  // const loginState: LoginContext = {
  //   login: login, setLogin: setLogin
  // };

  const [authState, setAuthState] = React.useState<AuthState>();
  const AuthStateHooks: IAuthStateHooks = {
    authState: authState,
    setAuthState: setAuthState
  }
  const [user, setUser] = React.useState<any | undefined>();
  const UserDataStateHooks: IUserDataStateHooks = {
    user: user,
    setUser: setUser
  }
  


  return (
    <Router>
      <Switch>
        <div className="App">
          <AuthContext.Provider value={AuthStateHooks}>
          <UserDataContext.Provider value={UserDataStateHooks}>

            <GenericTemplate>
              <Route path="/" component={Landing} exact />
              <Route path="/buckets" component={MyBuckets} exact />
            </GenericTemplate>
          </UserDataContext.Provider>

          </AuthContext.Provider>
        </div>
      </Switch>
    </Router>
  );
}

// export default withAuthenticator(App);
export default App;

