import React, {Component} from 'react';
import Player from './../../components/Player/Player';
import styles from './VideoChat.css'
class VideoChat extends Component {
  render() {
    return (
      <div>
        <h1 className = {styles.Header}>Youtube Player</h1>
        <Player/>
      </div>
    );
  }
}

export default VideoChat;
