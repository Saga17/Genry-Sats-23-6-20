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

  
class Login extends Component {

    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
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

        const data = {email: this.state.email, password: this.state.password};
        const rules = {
            email: 'required|email',
            password: 'required|string|min:6'
        };

        validateAll(data, rules).then(() => {        
          axios.post('http://127.0.0.1:8000/login/', { email: this.state.email, password: this.state.password}).then(response => {
            if(!response.data.success)
            {
              NotificationManager.error(response.data.message);
              return;
            }
            this.props.dispatch({type:'updateAccessToken', access_token: response.data.token});
            this.props.history.push('/');
            NotificationManager.success('Successfully logged in');
          });
        }).catch((errors) => {
            console.log(errors);
            let errorsFormatted = {};

            errors.forEach(err => {
                errorsFormatted[err.field] = err.message;
            });

            this.setState({ errors: errorsFormatted});
        });

    }

    render() {
        const { classes } = this.props;

        if(this.props.access_token !== '') {
          this.props.history.push('/');
        }

        return (
            <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5" color="primary">
          Sign in 
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
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>

            </Grid>
            <Grid item>
              <Link href="/register" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>

    </Container>
        );
    }
}

Login.propTypes = {
    classes: PropTypes.object.isRequired,
  };

const mapStateToProps = state => ({
  access_token: state.access_token
});


export default connect(mapStateToProps)(withStyles(styles)(Login));