import React from 'react';
import './App.css';
import 'react-notifications/lib/notifications.css';

import { BrowserRouter as Switch, Route  } from 'react-router-dom';

import Login from './views/Login';
import Register from './views/Register';
import Inbox from './views/Inbox';
import {NotificationContainer} from 'react-notifications';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';


function App(props) {
  return (
    <div className="App">
      {
        props.access_token !== '' ? 
        <div className='logout'><Button variant="outlined" className='logout-button' color="primary" onClick={() => {props.dispatch({type:'updateAccessToken', access_token: ''});}}>
        Logout
      </Button></div>
        : ''
      }
      
      <NotificationContainer/>
      <Switch>
            <Route path='/login' component={Login} />
            <Route path='/register' component={Register} />
            <Route exact path='/' component={Inbox} />
      </Switch>
    </div>
  );
}

const mapStateToProps = state => ({
  access_token: state.access_token
});

export default connect(mapStateToProps)(App);
