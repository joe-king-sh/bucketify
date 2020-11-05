import React from 'react';
// import logo from './logo.svg';
import './App.css';

// Routing
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";



// Amplify
// import { 
//   withAuthenticator,
//   AmplifySignOut 
// } from '@aws-amplify/ui-react'

import Landing from './components/05_pages/landing';
import MyBuckets from './components/05_pages/myBuckets';
import GenericTemplate from './components/04_templates/genericTemplate';



const App: React.FC = () => {

  return (
    <Router>
      <Switch>
        <div className="App">
          <GenericTemplate>
            <Route path="/" component={Landing} exact />
            <Route path="/buckets" component={MyBuckets} exact />
            {/* <AmplifySignOut /> */}
          </GenericTemplate>
        </div>
      </Switch>
    </Router>
  );
}

// export default withAuthenticator(App);
export default App;

