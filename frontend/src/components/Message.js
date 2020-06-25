import React, { Component } from 'react';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

import '../_styles/Message.css';

class Message extends Component {


    constructor(props) {
        super(props);
        this.state = {
            
        };
    }

    render() {
        
        return (
            <div>
                <div className='message-container'>
                    <div className='message-header'>
                        <div className='header-m'>
                            <ListItem alignItems="flex-start" className='message-desc' >
                                <ListItemAvatar>
                                <Avatar className='avatarBigger' alt={ this.props.msg.sender.charAt(0).toUpperCase() + this.props.msg.sender.slice(1) } src="/" />
                                </ListItemAvatar>
                                <ListItemText
                                className='msg-item-text'
                                primary={this.props.msg.subject}
                                secondary={
                                    <React.Fragment>
                                        <Typography
                                            component="span"
                                            variant="body1"
                                            className='inbox-inline spacing-text msg-item-text'
                                            color="textPrimary"
                                        >
                                            { this.props.msg.sender } 
                                        </Typography>
                                    </React.Fragment>}/>
                            </ListItem> 
                            <div className='subject'>
                                <Typography
                                        component="span"
                                        variant="body1"
                                        className='inbox-inline spacing-text msg-item-text'
                                        color="textPrimary"
                                    >
                                        Subject: 
                                </Typography>{ this.props.msg.subject }
                                <br/>
                                <Typography
                                        component="span"
                                        variant="body1"
                                        className='inbox-inline spacing-text msg-item-text'
                                        color="textPrimary"
                                    >
                                        Sent at: 
                                </Typography>{ this.props.msg.creation_date }
                                <br/>
                                <Typography
                                        component="span"
                                        variant="body1"
                                        className='inbox-inline spacing-text msg-item-text'
                                        color="textPrimary"
                                    >
                                        To: 
                                </Typography>{ this.props.msg.receiver }
                                
                                
                                
                                
                            </div>
                            {this.props.ignore ? '' : <div className='delete' fontSize='large' onClick={this.props.delete}><DeleteForeverIcon className='delete-icon'/></div>}
                        </div>
                            
                        
                    </div>
                   
                    <div className="message-data">
                        { this.props.msg.message }
                    </div>
                    
                </div>
            </div>
        );
    }
};


export default Message;
