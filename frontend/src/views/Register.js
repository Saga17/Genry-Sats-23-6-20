import React, { Component } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';

import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import PropTypes from 'prop-types';
import { validateAll } from 'indicative/validator';
import {NotificationManager} from 'react-notifications';

import { connect } from 'react-redux';

import axios from 'axios';

const styles = (theme) => ({
    paper: {
      marginTop: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
  });

  
class Register extends Component {

    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            rpassword: '',
            username: '',
            errors: {}
        };
    }

    handleInputChange(event) {
        const target = event.target;    
        this.setState({
          [target.name]: target.value
        });
    }

    handleSubmit = (event) => {
        event.preventDefault();

        const data = {email: this.state.email, password: this.state.password, username: this.state.username};
        if(this.state.rpassword !== this.state.password) {
            this.setState(state => (
              {
              errors: { ...state.errors, rpassword: "Password doesn't match"}
              }
            ));
            return;
        }
        const rules = {
            email: 'required|email',
            password: 'required|string|min:6|max:20',
            username: 'required|string|min:4|max:20'
        };

        validateAll(data, rules).then(() => {        
          axios.post(`${this.props.url}/register/`, { email: this.state.email, password: this.state.password, username: this.state.username}).then(response => {
            if(!response.data.success)
            {
              NotificationManager.error(response.data.message);
              return;
            }
            this.props.dispatch({type:'updateAccessToken', access_token: response.data.token});
            this.props.history.push('/');
            NotificationManager.success('Successfully registered ');
          });
        }).catch((errors) => {
            let errorsFormatted = {};

            errors.forEach(err => {
                errorsFormatted[err.field] = err.message;
            });

            this.setState({ errors: errorsFormatted});
        });

    }

    render() {
        const { classes } = this.props;

        return (
            <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5" color="primary">
          Sign up 
        </Typography>
        <form className={classes.form} noValidate onSubmit={this.handleSubmit.bind(this)}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            value={this.state.email} 
            onChange={this.handleInputChange.bind(this)}
            name="email"
            autoComplete="email"
            error={this.state.errors['email'] ? true : false}
            helperText={this.state.errors['email'] ? this.state.errors['email']: ''}
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            value={this.state.username} 
            onChange={this.handleInputChange.bind(this)}
            name="username"
            autoComplete="username"
            error={this.state.errors['username'] ? true : false}
            helperText={this.state.errors['username'] ? this.state.errors['username']: ''}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            value={this.state.password} 
            onChange={this.handleInputChange.bind(this)}
            name="password"
            label="Password"
            type="password"
            id="password"
            error={this.state.errors['password'] ? true : false}
            helperText={this.state.errors['password'] ? this.state.errors['password']: ''}
            autoComplete="current-password"
          />

        <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            value={this.state.rpassword} 
            onChange={this.handleInputChange.bind(this)}
            name="rpassword"
            label="Repeat Password"
            type="password"
            id="rpassword"
            error={this.state.errors['rpassword'] ? true : false}
            helperText={this.state.errors['rpassword'] ? this.state.errors['rpassword']: ''}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign Up
          </Button>
          <Grid container>
            <Grid item xs>

            </Grid>
            <Grid item>
              <Link href="/login" variant="body2">
                {"Already have an account? Sign in"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>

    </Container>
        );
    }
}

Register.propTypes = {
    classes: PropTypes.object.isRequired,
  };

const mapStateToProps = state => ({
  access_token: state.access_token,
  url: state.url
});

export default connect(mapStateToProps)(withStyles(styles)(Register));