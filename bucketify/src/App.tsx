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

import Landing from './components/pages/Landing';
import MyBuckets from './components/pages/MyBuckets';



const App: React.FC = () => {

  return (
      <Router>
        <Switch>
          <div className="App">
            <Route path="/" component={Landing} exact />
            <Route path="/buckets" component={MyBuckets} exact />
            {/* <AmplifySignOut /> */}
          </div>
      </Switch>
      </Router>
  );
}

// export default withAuthenticator(App);
export default App;

