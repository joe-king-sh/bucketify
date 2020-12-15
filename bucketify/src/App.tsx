import React from 'react';

// Routing
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// import PrivateRoute from './components/03_organisms/privateRoot'

// Auth
import { AuthState } from '@aws-amplify/ui-components';

// Pages
import Landing from './components/04_pages/landing';
import ScanBuckets from './components/04_pages/scanBuckets';
import NotFound from './components/04_pages/404';
import Songs from './components/04_pages/songs';
// import SignIn from './components/05_pages/signIn'
import SignUp from './components/04_pages/signUp';
import Accounts from './components/04_pages/accounts';

// template
import GenericTemplate from './components/03_templates/genericTemplate';
import LoginRequiredWrapper from './components/03_templates/loginRequiredWrapper';

// TestPage
import GraphqlTest from './components/04_pages/graphqlTest';
import GraphqlAudioTest from './components/04_pages/graphqlAudioTest';

// Auth Status
export interface IAuthStateHooks {
  authState: AuthState | undefined;
  setAuthState: React.Dispatch<React.SetStateAction<AuthState | undefined>>;
}
// const defaultAuthStateHooks: IAuthStateHooks = {
//   authState: AuthState.SignOut,
//   setAuthState: React.Dispatch(),
// };
export const AuthContext = React.createContext<IAuthStateHooks>({} as IAuthStateHooks);

// Cognito UserData
export interface IUserDataStateHooks {
  // eslint-disable-next-line
  user: any | undefined; // Using object type is restricted, but amplify is using object type yet. 
  // eslint-disable-next-line
  setUser: React.Dispatch<React.SetStateAction<any | undefined>>;
}
// const defaultUserDataStateHooks = {
//   user: undefined,
//   setUser: () => {},
// };
export const UserDataContext = React.createContext<IUserDataStateHooks>({} as IUserDataStateHooks);

const App: React.FC = () => {
  const [authState, setAuthState] = React.useState<AuthState>();
  const AuthStateHooks: IAuthStateHooks = {
    authState: authState,
    setAuthState: setAuthState,
  };
  // eslint-disable-next-line
  const [user, setUser] = React.useState<object | undefined>();
  const UserDataStateHooks: IUserDataStateHooks = {
    user: user,
    setUser: setUser,
  };

  return (
    <AuthContext.Provider value={AuthStateHooks}>
      <UserDataContext.Provider value={UserDataStateHooks}>
        <Router>
          <Switch>
            {/* Login not required route */}
            <Route exact path={['/', '/signup']}>
              <GenericTemplate>
                <LoginRequiredWrapper isLoginRequired={false}>
                  <Route exact path="/" component={Landing} />
                  {/* <Route exact path="/signin" component={SignIn} /> */}
                  <Route exact path="/signup" component={SignUp} />
                </LoginRequiredWrapper>
              </GenericTemplate>
            </Route>

            {/* Login required route */}
            <Route exact path={['/accounts', '/bucket', '/songs', '/test', '/test2']}>
              <Switch>
                <GenericTemplate>
                  <LoginRequiredWrapper isLoginRequired={true}>
                    <Route exact path="/accounts" component={Accounts} />
                    <Route exact path="/bucket" component={ScanBuckets} />
                    <Route exact path="/songs" component={Songs} />

                    <Route exact path="/test" component={GraphqlTest} />
                    <Route exact path="/test2" component={GraphqlAudioTest} />
                  </LoginRequiredWrapper>
                </GenericTemplate>
              </Switch>
            </Route>

            {/* Wrong url route */}
            <Route
              render={() => (
                <GenericTemplate>
                  <NotFound />
                </GenericTemplate>
              )}
            />
          </Switch>
        </Router>
      </UserDataContext.Provider>
    </AuthContext.Provider>
  );
};

// export default withAuthenticator(App);
export default App;
