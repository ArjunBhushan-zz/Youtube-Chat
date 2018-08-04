import React, {Component} from 'react';
import styles from './Player.css';
import ReactPlayer from 'react-player';
import windowSize from 'react-window-size';
import Button from './../UI/Button/Button';
import Input from './../UI/Input/Input';

class Player extends Component {
  state = {
    progress: {
      playedSeconds: 0,
      played: 0
    },
    currentUrl:'',
    urlTouched: false,
    urlValid: false,
    playingUrl: 'https://www.youtube.com/watch?v=w0Aa_aaf3XcY'
  }
  validateUrl = (url) => {
    return ReactPlayer.canPlay(url);
  }
  ref = player => {
    this.player = player
  }
  onProgressHandler = (progress) => {
    this.setState({progress});
  }
  onUpdateUrlHandler = (e) => {
    e.preventDefault();
    if (this.validateUrl(this.state.currentUrl)) {
      this.setState((prevState) => {
        return {playingUrl: prevState.currentUrl, urlValid: true};
      });
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
          playing
          loop
          width = {this.props.windowWidth*0.8}
          height = {this.props.windowWidth*9/16*0.8}
          progressInterval ={1}
          onProgress = {this.onProgressHandler}/>
      </div>
    );
  }
}
export default windowSize(Player);
