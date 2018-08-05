import React, {Component} from 'react';
import styles from './Player.css';
import ReactPlayer from 'react-player';
import windowSize from 'react-window-size';
import Button from './../UI/Button/Button';
import Input from './../UI/Input/Input';
import io from 'socket.io-client';


class Player extends Component {
  state = {
    currentUrl:'',
    urlTouched: false,
    urlValid: false,
    playingUrl: 'https://www.youtube.com/watch?v=O_VxJn9U_O0?vq=small',
    roomOwner: false,
    videoPaused: false,
    user: {
      username: 'Arjun',
      room: 'Room_Id',
    }
  }
  componentDidUpdate(prevProps, prevState){
    if (prevState.user.room !== this.state.user.room) {
      this.socket.emit('join', this.state.user);
      this.socket.emit('unsubscribe', prevState.user);
    }
  }
  componentDidMount () {
    const socket = io('http://localhost:8080');
    this.socket = socket;
    socket.emit('join', this.state.user);

    socket.on('timeSync', (newTime) => {
      console.log(newTime);
      if (!this.state.videoPaused){
        this.player.seekTo(newTime);
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
    })
    // socket.on('timeSync', ())
  }
  componentWillUnmount() {
    this.socket.close();
  }
  validateUrl = (url) => {
    return ReactPlayer.canPlay(url);
  }
  ref = player => {
    this.player = player
  }
  onProgressHandler = (progress) => {
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
          urlValid: false,
          roomOwner: true
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
  changeRoom = () => {
    this.setState({
      user: {
        ...this.state.user,
        room: 'Different_Room'
      }
    });
  }
  render() {
    return (
      <div>
        <form onSubmit = {(e) => this.onUpdateUrlHandler(e)}>
          <div className = {styles.Form}>
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
            <Button buttonType = 'Danger'>Change URL</Button>
          </div>
        </form>

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
        <p onClick = {this.changeRoom}>Change Room</p>
      </div>
    );
  }
}
export default windowSize(Player);