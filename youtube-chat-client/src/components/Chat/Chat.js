import React, {Component} from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import io from 'socket.io-client';
import styles from './Chat.css';
import collapseArrow from './../../assets/images/collapse-arrow.png';
import expandArrow from './../../assets/images/expand-arrow.png';
import Message from './Message/Message';
import Input from './../UI/Input/Input';
class Chat extends Component {
  state = {
    user: {
      username: this.props.username || localStorage.getItem('username'),
      room: this.props.room,
      display: this.props.display,
      token: this.props.token
    },
    messages: [],
    showMessages: false,
    controls: {
      message: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Message'
        },
        value: '',
        validation: {
          required: true,
          minLength: 1
        },
        valid: false,
        touched: false
      }
    },
    currentUsers: []
  }

  checkValidity = (value, rules) => {
    if (!rules){
      return true;
    }
    let isValid = true;
    if (rules.required) {
      isValid = isValid && value.trim() !== '';
    }
    if (rules.minLength) {
      isValid = isValid && (value.trim().length >= rules.minLength);
    }
    return isValid;
  }

  inputChangedHandler = (id, event) => {
    const updatedControls = {
      ...this.state.controls,
      [id]: {
        ...this.state.controls[id],
        value: event.target.value,
        valid: this.checkValidity(event.target.value, this.state.controls[id].validation),
        touched: true
      }
    };
    this.setState({controls: updatedControls});
  }

  componentDidMount () {
    //get all previous in messages the room
    //const socket = io('http://localhost:8080/');
    const socket = io('https://youtube-chat-socket.herokuapp.com/');
    this.socket = socket;
    socket.on('connect', () => {
      socket.emit('join', this.state.user);
      socket.emit('sendRooms');
    });
    socket.on('newMessage', (message) => {
      this.setState({
        messages: this.state.messages.concat(message),
        controls: {
          ...this.state.controls,
          message: {
            ...this.state.controls.message,
            value: ''
          }
        }
      });
    });
    socket.on('getRooms', (rooms) => {
      if (!rooms) {
        return;
      }
      rooms.forEach((room) => {
        if (room.name === this.props.room) {
          let currentUsers = [];
          room.users.forEach((user, index) => {
            if (user.username && currentUsers.indexOf(user.username) === -1){
              currentUsers.push(user.username);
            }
          });
          this.setState({currentUsers})
        }
      });
    });
  }
  componentWillUnmount() {
    this.socket.emit('unsubscribe', this.state.user);
    this.socket.emit('sendRooms');
    this.socket.close(this.state.user);
  }
  onShowComments = () => {
    if (this.state.showMessages){
      return this.setState({showMessages: false});
    }
    axios({
      method: 'get',
      url: `https://youtube-chat-api.herokuapp.com/rooms/${this.state.user.room}`,
      headers: {'x-auth': this.props.token}
    })
      .then((roomInfo) => {
        let messagePromises = [];
        roomInfo.data.messages.forEach((message) => {
          messagePromises.push(axios({
              method: 'get',
              url: `https://youtube-chat-api.herokuapp.com/messages/${message._message}`,
              headers: {'x-auth': this.props.token}
            }));
        });
        Promise.all(messagePromises)
          .then((messages) => {
            let displayPromises = [];
            let roomMessages = [];
            messages.forEach((message, index) => {
              roomMessages[index] = {
                text: message.data.text,
                date: message.data.date
              };
              displayPromises.push(axios({
                method: 'get',
                url: `https://youtube-chat-api.herokuapp.com/users/user/${message.data._user}`,
                headers: {'x-auth': this.props.token}
              }));
            });
            Promise.all(displayPromises)
              .then((displays) => {
                displays.forEach((display,index) => {
                  if(!display.data.display) {
                    display.data.display = display.data.username;
                  }
                  roomMessages[index].display = display.data.display;
                });
                this.scrollToBottom = () => {
                  this.messagesEnd.scrollIntoView({ behavior: "smooth" });
                }
                this.setState({messages: roomMessages, showMessages: true});
              })
              .catch((err) => {
                this.setState({showMessages: true, messages: [{
                  display: 'Admin',
                  text: 'Something went wrong. Could not load chat.',
                  date: Date.now()
                }]});
              });
          })
          .catch((err) => {
            this.setState({showMessages: true, messages: [{
              display: 'Admin',
              text: 'Something went wrong. Could not load chat.',
              date: Date.now()
            }]});
          });
      })
      .catch((err) => {
        this.setState({showMessages: true, messages: [{
          display: 'Admin',
          text: 'Something went wrong. Could not load chat.',
          date: Date.now()
        }]});
      });
  };
  newMessageHandler = (e) =>{
    e.preventDefault();
    if (!this.props.token){
      this.socket.emit('createMessage', this.state.user, this.state.controls.message.value);
    }else{
      this.socket.emit('createMessage', this.state.user, this.state.controls.message.value);
    }
  }

  componentDidUpdate(prevProps, prevState){
    if (this.state.showMessages && this.state.messages && prevState.messages && this.state.messages.length !== prevState.messages.length){
      this.scrollToBottom();
    }
  }

  render(){
    const formElementsArray = [];
    for (let key in this.state.controls){
      formElementsArray.push({
        id: key,
        config: this.state.controls[key]
      });
    }
    let form = formElementsArray.map((formElement) => {
      if (!this.state.isSignup && formElement.id === 'display'){
        return null;
      }
      return (
        <Input elementType = {formElement.config.elementType}
          elementConfig = {formElement.config.elementConfig}
          value= {formElement.config.value}
          key = {formElement.id}
          changed = {this.inputChangedHandler.bind(this, formElement.id)}
          invalid = {!formElement.config.valid}
          shouldValidate = {formElement.config.validation}
          touched = {formElement.config.touched}
        />
      );
    });

    let messages = null;
    if (this.state.messages.length){
      messages = this.state.messages.map((message) => {
        return <Message display = {message.display} date = {message.date} text = {message.text}  key={`${message.display}-${message.date}-${message.text}`}/>
      });
    }
    let createMessage = (
      <div className = {styles.Footer}>
        <form onSubmit = {this.newMessageHandler}>
          {form}
        </form>
      </div>
    );
    let users = (
      <div className = {styles.Users}>
        {this.state.currentUsers.map((user) => {
          return <p key = {user}>{user}</p>
        })}
      </div>
    );
    return(
      <div className = {styles.Chat}>
        <div className = {styles.Header} onClick = {this.onShowComments}>
          <h1>Chat Room</h1>
          {this.state.showMessages ? <img  src={collapseArrow} alt="collapseArrow"/> : <img  src={expandArrow} alt="expandArrow"/>}
        </div>
        {this.state.showMessages ? users : null}
        <div className = {styles.Body}>
          {this.state.showMessages ? messages : null}
          <div style={{ float:"left", clear: "both" }}
            ref={(el) => { this.messagesEnd = el; }}>
          </div>
        </div>
         {this.state.showMessages ? createMessage : null}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
      token: state.auth.token,
      username: state.auth.username,
      display: state.me.display,
  };
};

export default withRouter(connect(mapStateToProps)(Chat));
