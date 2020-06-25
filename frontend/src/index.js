import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { createStore } from "redux";
import { Provider } from 'react-redux';

const store = createStore((state = { url: 'http://127.0.0.1:8000', access_token: localStorage.getItem('access_token') ? localStorage.getItem('access_token') : '' }, action) => {
  switch(action.type) {
    case 'updateAccessToken':
      localStorage.setItem('access_token', action.access_token);
      return { access_token: action.access_token, url: state.url };
    default:
      return state;
  }
});

ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>
  ,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
