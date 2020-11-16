import React from 'react';

// Routing
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
// Auth
import { AuthState } from '@aws-amplify/ui-components';

// Pages
import Landing from './components/05_pages/landing';
import ScanBuckets from './components/05_pages/scanBuckets';
import NotFound from './components/05_pages/404'
// import SignIn from './components/05_pages/signIn'
import SignUp from './components/05_pages/signUp'
import Accounts from './components/05_pages/accounts'


// Auth Status
export interface IAuthStateHooks {
  authState: AuthState | undefined,
  setAuthState: React.Dispatch<React.SetStateAction<AuthState | undefined>>
}
const defaultAuthStateHooks: IAuthStateHooks = {
  authState: AuthState.SignOut,
  setAuthState: () => {}
}
export const AuthContext = React.createContext<IAuthStateHooks>(defaultAuthStateHooks);

// Cognito UserData
export interface IUserDataStateHooks {
  user: any, // The type of authData is any... https://aws-amplify.github.io/amplify-js/api/interfaces/iauthenticatorprops.html#authdata
  setUser: React.Dispatch<any>
}
const defaultUserDataStateHooks = {
  user: undefined,
  setUser: () => {}
}
export const UserDataContext = React.createContext<IUserDataStateHooks>(defaultUserDataStateHooks);



const App: React.FC = () => {

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
    <AuthContext.Provider value={AuthStateHooks}>
      <UserDataContext.Provider value={UserDataStateHooks}>
        <Router>
          <Switch>
            <Route exact path="/" component={Landing} />
            {/* <Route exact path="/signin" component={SignIn} /> */}
            
            <Route exact path="/signup" component={SignUp} />
            <Route exact path="/accounts" component={Accounts} />
            <Route exact path="/buckets" component={ScanBuckets} />

            <Route component={NotFound} />
          </Switch>
        </Router>
      </UserDataContext.Provider>
    </AuthContext.Provider>
  );
}

// export default withAuthenticator(App);
export default App;

