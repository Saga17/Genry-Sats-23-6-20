import React, { Component } from 'react';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import Autocomplete from '@material-ui/lab/Autocomplete';
import axios from 'axios';
import { validateAll } from 'indicative/validator';
import {NotificationManager} from 'react-notifications';

import { connect } from 'react-redux';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';

import '../_styles/CreateMessage.css';

class CreateMessage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            msg: '',
            recepient: '',
            subject: '',
            suggestions: [],
            errors: []
        };
    }

    handleInputChange = (event, flag=null) => {
        
        const target = event.target;

        this.setState({
          [flag ? 'recepient': target.name]: flag ? flag.email : target.value
        }, () => {
            if(target.name === 'recepient' && this.state.recepient.length > 3) {
                axios.post('http://localhost:8000/search/', {email: this.state.recepient}, { headers: {'Authorization': this.props.access_token }}).then((ans) => {
                    if(ans.data.success){
                        this.setState(state => ({
                            suggestions: ans.data.suggestions
                        }));
                    }
                });
                
            }
        });
    }
    sendMessage = () => {
        const rules = {
            recepient: 'required|email',
            subject: 'required|string|min:3',
            msg: 'required|string|min:3',
        };
        const data = {recepient: this.state.recepient, subject: this.state.subject, msg: this.state.msg};

        validateAll(data, rules).then(() => {        
            axios.post('http://localhost:8000/sendmessage/', { receiver: this.state.recepient, subject: this.state.subject, message: this.state.msg}, { headers: {'Authorization': this.props.access_token }}).then(response => {
                
            if(!response.data.success)
              {
                if(typeof response.data.err == 'object') {
                    for(let i in response.data.err) {
                        NotificationManager.error(`${i} ${response.data.err[i]}`);
                    }
                }else {
                    NotificationManager.error(response.data.err);
                }
                
                return;
              }
              
              NotificationManager.success('Successfully sent the message');
              this.props.close();
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
        
        return (
            <div className='wrapper'>
                <DialogTitle id="form-dialog-title">Send a new message</DialogTitle>
        <DialogContent>
          <DialogContentText>
            
          </DialogContentText>
          <div className='spacing'>
            <Autocomplete
                freeSolo
                onChange={this.handleInputChange}
                name='recepient'
                type="email"
                
                options={this.state.suggestions}
                getOptionLabel={(option) => option.email}
                renderOption={(option) => (
                    <React.Fragment>
                        {option.email}
                    <CheckCircleOutlineIcon className='label-icon' />
                    </React.Fragment>
                )}
                renderInput={(params) => <TextField {...params} error={this.state.errors['recepient'] ? true : false}
                helperText={this.state.errors['recepient'] ? this.state.errors['recepient']: ''}
                name='recepient' margin="dense" label="Recepient" fullWidth autoFocus value={this.state.recepient} onChange={this.handleInputChange}/>}
            />
          </div>
          <div className='spacing'>
            <TextField
                name='subject'
                margin="dense"
                label="Subject"
                type="email"
                value={this.state.subject}
                onChange={this.handleInputChange}

                error={this.state.errors['subject'] ? true : false}
                helperText={this.state.errors['subject'] ? this.state.errors['subject']: ''}
                fullWidth
            />
          </div>
          <div className='spacing space-lower'>
            <TextField multiline fullWidth
                name='msg'
                value={this.state.msg}
                onChange={this.handleInputChange}
                label="Message content"
                error={this.state.errors['msg'] ? true : false}
                helperText={this.state.errors['msg'] ? this.state.errors['msg']: ''}
            />
          </div>
          
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.close} color="primary">
            Cancel
          </Button>
          <Button onClick={this.sendMessage} color="primary">
            Send
          </Button>
        </DialogActions>
            </div>
        );
    }
};

const mapStateToProps = state => ({
    access_token: state.access_token
});
export default connect(mapStateToProps)(CreateMessage);
