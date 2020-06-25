import React, { Component } from 'react';
import {NotificationManager} from 'react-notifications';
import { connect } from 'react-redux';

import Switch from '@material-ui/core/Switch';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';

import Message from '../components/Message';

import axios from 'axios';

import CircularProgress from '@material-ui/core/CircularProgress';

import '../_styles/Inbox.css';

import CreateMessage from '../components/CreateMessage';

import Icon from '@material-ui/core/Icon';
import MessageIcon from '@material-ui/icons/Message';
import Dialog from '@material-ui/core/Dialog';


class Inbox extends Component {


    constructor(props) {
        super(props);
        this.state = {
            sent: false, //received/sent messages
            loading: true,
            currMsg: null,
            messages:[],
            createMessage: false,

        };
    }

    componentDidMount() {
        this.getMessages();
    }

    closeDialog = () => {
        this.setState(state => ({
            createMessage: false
        }));
        this.getMessages();
    }
    
    getMessages = () => {
        axios.get(`${this.props.url}/messages/${this.state.sent ? 'sent' : 'received'}`, { headers: {'Authorization': this.props.access_token }}).then((response) => {
            let ans = response.data;
            let messages = [];

            if(!ans.success) {
                if(ans.err === 'Wrong token') {
                    this.props.dispatch({type:'updateAccessToken', access_token: ''});
                    NotificationManager.error('You have to be logged in');
                    this.props.history.push('/login');
                }else NotificationManager.error(ans.err);
            }else {
                messages = ans.messages;
            }
            setTimeout(() => {
                this.setState(state => ({
                    messages: messages,
                    loading: false,
                }));
            }, 500);
            
            return messages;
        });
    }

    handleChange = () => {
        this.setState({ sent: !this.state.sent, loading: true, messages: [] }, () => {
            this.getMessages();
        });
    };

    handleClick = (msg) => {
        this.setState(state => ({
            currMsg: msg
        }));
    }

    deleteMsg = (msg) => {
        axios.get(`${this.props.url}/message/delete/${msg.id}`, { headers: {'Authorization': this.props.access_token }}).then(res => {
            let ans = res.data;
            if(ans.success) {
                NotificationManager.success(ans.message);
                this.setState(state => ({
                    currMsg: null
                }));
                this.getMessages();
            }else {
                NotificationManager.error(ans.err);
            }
        });
    }

    render() {
        
        if(this.props.access_token === ''){
            this.props.history.push('/login');
        }
        return (
            <div id='inbox'>
                <Dialog fullWidth={true} maxWidth = {'md'} open={this.state.createMessage} onClose={() => {}} aria-labelledby="form-dialog-title">
                    <CreateMessage close={this.closeDialog}/>
                </Dialog>
                <div className='top-header'>
                <div id="switch-inbox">
                Received<Switch
                    checked={this.state.sent}
                    onChange={this.handleChange}
                    value="sent"
                    color="primary"
                    size="medium"
                />Sent
                </div>
                <div className='tooltip icon-wrapper' onClick={() => {this.setState(state => ({  createMessage: true}))}}>
                 <Icon className='icon-add' title='Send new message' >add_circle
                 </Icon>
                 <span className="tooltiptext">Send new</span>

                 </div>
                 

                </div>
                <center>
                    <div id="inbox-container">
                        {
                            (this.state.messages.length > 0 ? (<div>
                            <div className='left' >
                        <List className='inbox-list'>
                            {this.state.messages.map((msg, index) => (
                                <ListItem alignItems="flex-start" className={'message ' + (((this.state.currMsg && this.state.currMsg.id === msg.id) || (index === 0 && !this.state.currMsg) ? 'message-active' : ''))} key={index} onClick={() => this.handleClick(msg)}>
                                    <ListItemAvatar>
                                    <Avatar alt={ msg.sender.charAt(0).toUpperCase() + msg.sender.slice(1) } src="/" />
                                    </ListItemAvatar>
                                    <ListItemText
                                    primary={msg.subject}
                                    secondary={
                                        <React.Fragment>
                                        <Typography
                                            component="span"
                                            variant="body2"
                                            className='inbox-inline spacing-text'
                                            color="textPrimary"
                                        >
                                            { msg.sender } 
                                        </Typography>
                                        { msg.message.substring(0, 20) + '...' }
                                        </React.Fragment>}/>
                                        
                                </ListItem>  
                            ))}

                        </List>
                        </div>

                        <div className='right'>
                            <Message msg={this.state.currMsg ? this.state.currMsg : this.state.messages[0]} ignore={this.state.sent} delete={() => {this.deleteMsg(this.state.currMsg ? this.state.currMsg : this.state.messages[0])}}/>
                        </div>
                        </div>)
                            : <div>{this.state.loading ? <CircularProgress size={100} className='loading'/> : <div className='top-space'><div><MessageIcon className='not_found'/></div><div>No Messages, Try to send some :)</div></div>}</div>)
                        }
                        
                    </div>
                </center>
                
                
            </div>
        );
    }
};
const mapStateToProps = state => ({
    access_token: state.access_token,
    url: state.url
});

export default connect(mapStateToProps)(Inbox);
