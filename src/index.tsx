import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import Store from './store';
import App from './App';
import * as serviceWorker from './serviceWorker';
import './index.css';

import Amplify from "aws-amplify";
import awsExports from "./aws-exports";
Amplify.configure(awsExports);


ReactDOM.render(
  <Provider store={Store}>
    <App />
  </Provider>,
  document.getElementById('root') as HTMLElement
);

// Browser cache is enable. 
serviceWorker.register(undefined);
