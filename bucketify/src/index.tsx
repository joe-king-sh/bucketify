import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
//amplify
import Amplify from "aws-amplify";
import awsExports from "./aws-exports";
//Grobal reset
import CssBaseline from '@material-ui/core/CssBaseline';

// Parallax
import { ParallaxProvider } from 'react-scroll-parallax';


import App from './App';


Amplify.configure(awsExports);

ReactDOM.render(
  <React.StrictMode>
    <CssBaseline />
    <ParallaxProvider>
      <App />
    </ParallaxProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
