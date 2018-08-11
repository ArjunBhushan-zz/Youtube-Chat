import React, {Component} from 'react';
import styles from './Player.css';
import ReactPlayer from 'react-player';
import windowSize from 'react-window-size';
import Button from './../UI/Button/Button';
import Input from './../UI/Input/Input';
import io from 'socket.io-client';
import { connect } from 'react-redux';
import Auxiliary from './../../hoc/Auxiliary/Auxiliary';
import axios from 'axios';
import { withRouter } from 'react-router-dom';

const getAverage = (array) => {
  let averageLatency = 0;
  let length = array.length;
  if (length < 5){
    for (let i=0; i<length; i++){
      averageLatency = averageLatency + array[i];
      if (i === length - 1){
        averageLatency = averageLatency/length;
        return averageLatency;
      }
    }
  }else{
    for (let i=length-5; i<length; i++){
      averageLatency = averageLatency + array[i];
      if (i === length - 1){
        averageLatency = averageLatency/5;
        return averageLatency;
      }
    }
  }
  return 0;
};

class Player extends Component {
  state = {
    currentUrl:'',
    urlTouched: false,
    urlValid: false,
    playingUrl: 'https://www.youtube.com/watch?v=vLTijKmSq4Y',
    roomOwner: false,
    videoPaused: false,
    user: {
      username: this.props.username || localStorage.getItem('username'),
      room: this.props.room,
    },
    error: null
  }
  componentDidMount () {
    //checkOwnership if fails for any reason, assumes you are not/incapable of being one
    axios({
      method: 'get',
      url: `https://youtube-chat-api.herokuapp.com/rooms/${this.state.user.room}`,
      headers: {
        'x-auth': this.props.token || localStorage.getItem('token')
      }
    })
      .then((owner) => {
        axios({
          method: 'get',
          url: `https://youtube-chat-api.herokuapp.com/users/me`,
          headers: {
            'x-auth': this.props.token || localStorage.getItem('token')
          }
        })
          .then((user) => {
            if (owner.data._owner === user.data._id) {
              this.setState({roomOwner: true});
            }
          });
      });
    //const socket = io('http://localhost:8080/');
    const socket = io('https://youtube-chat-socket.herokuapp.com/');
    this.socket = socket;
    socket.on('connect', () => {
      socket.emit('join', this.state.user);
    });
    socket.on('timeSync', (newTime, sockets) => {
      if (!this.state.videoPaused){
        let clientLatency = 0;
        for (let i=0; i<sockets.length; i++){
          if (sockets[i].socketId === socket.id){
            clientLatency = getAverage(sockets[i].latency);
          }
        }
        this.player.seekTo(newTime + (clientLatency/2)/1000);
      }
    });
    socket.on('pauseVideo', () => {
      this.setState({videoPaused: true});
    });
    socket.on('playVideo', () => {
      this.setState({videoPaused: false});
    });
    socket.on('urlSync', (newUrl) => {
      this.setState({
          playingUrl: newUrl,
          currentUrl: '',
          urlTouched: false,
          urlValid: false
        }
      );
    });
    socket.on('roomDisbanded', () => {
      this.props.history.push('/');
    });
    socket.on('setLatency', (cb) => {
      cb();
    });
  }
  componentWillUnmount() {
    this.socket.emit('unsubscribe', this.state.user);
    this.socket.close(this.state.user);
  }
  validateUrl = (url) => {
    return ReactPlayer.canPlay(url);
  }
  ref = player => {
    this.player = player
  }
  onProgressHandler = (progress) => {
    this.socket.emit('updateLatency', this.state.user);
    if (this.state.roomOwner && !this.state.videoPaused) {
      this.socket.emit('timeChange', this.state.user, progress.playedSeconds);
    }
  }
  onPauseHandler = () => {
    if (this.state.roomOwner) {
      this.socket.emit('pause', this.state.user);
      this.setState({videoPaused: true});
    }
  }
  onPlayHandler = () => {
    if (this.state.roomOwner) {
      this.socket.emit('play', this.state.user);
      this.setState({videoPaused: false});
    }
  }
  onUpdateUrlHandler = (e) => {
    e.preventDefault();
    if (this.validateUrl(this.state.currentUrl)) {
      this.setState({
          playingUrl: this.state.currentUrl,
          currentUrl: '',
          urlTouched: false,
          urlValid: false
        }
      );
      this.socket.emit('urlChange', this.state.user, this.state.currentUrl);
    }
  }
  onURLChanged = (e) => {
    e.preventDefault();
    if (this.validateUrl(e.target.value)) {
      this.setState({currentUrl: e.target.value, urlTouched: true, urlValid: true});
    } else {
      this.setState({currentUrl: e.target.value, urlTouched: true});
    }
  }
  deleteRoomHandler = () => {
    axios({
      method: 'delete',
      headers: {'x-auth': this.props.token},
      url: `https://youtube-chat-api.herokuapp.com/rooms/${this.state.user.room}`
    })
      .then((res) => {
        this.socket.emit('roomDeleted', this.state.user);
        this.props.history.push('/');
      })
      .catch((err) => {
        this.setState({error: 'Could not delete room'});
      });
  }
  render() {
    const form = (
      <div className = {styles.Url}>
        <form onSubmit = {(e) => this.onUpdateUrlHandler(e)}>
          <div>
            <Input
              elementType = 'input'
              value = {this.state.currentUrl}
              elementConfig = {{
                type: 'text',
                placeholder: 'Video URL'
              }}
              invalid = {!this.state.urlValid}
              touched = {this.state.urlTouched}
              changed = {(e) => this.onURLChanged(e)}
            />
          </div>
        </form>
      </div>
    );
    const deleteButton = (
      <div className = {styles.Button}>
        <Button buttonType = 'Danger' clicked= {this.deleteRoomHandler}>DELETE ROOM</Button>
      </div>
    );
    let error = null;
    if (this.state.error) {
      error = (<p className = {styles.Error}> {this.state.error}</p>);
    }
    return (
      <Auxiliary>
        {error}
        {this.state.roomOwner ? form : null}
        <ReactPlayer
          ref = {this.ref}
          className = {styles.Player}
          url= {this.state.playingUrl}
          playing = {!this.state.videoPaused}
          loop
          width = {this.props.windowWidth*0.8}
          height = {this.props.windowWidth*9/16*0.8}
          progressInterval ={2500}
          onProgress = {this.onProgressHandler}
          onPause = {this.onPauseHandler}
          onPlay = {this.onPlayHandler}/>
        {this.state.roomOwner ? deleteButton : null}
      </Auxiliary>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    username: state.auth.username,
    token: state.auth.token
  };
};
export default withRouter(connect(mapStateToProps)(windowSize(Player)));
