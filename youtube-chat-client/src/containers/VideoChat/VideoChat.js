import React, {Component} from 'react';
import Player from './../../components/Player/Player';
import { withRouter, Redirect } from 'react-router-dom';
import axios from 'axios';
import Chat from './../../components/Chat/Chat';
import { connect } from 'react-redux';

class VideoChat extends Component {
  componentDidMount() {
    const room = this.props.location.search.slice(6);
    axios({
      method: 'get',
      url: `https://youtube-chat-api.herokuapp.com/rooms/${room}`,
      headers: {
        'x-auth': this.props.token || localStorage.getItem('token')
      }
    })
      .catch((err) => {
        this.props.history.push('/');
      });
  }
  render() {
    const room = this.props.location.search.slice(6);
    let sockets = (
      <Player room = {room}/>
    );
    if (!room) {
      sockets = <Redirect to= "/"/>;
    }
    let chat = (
      <Chat room = {room}/>
    );

    return (
      <div>
        {sockets}
        {chat}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.auth.token
  };
};

export default withRouter(connect(mapStateToProps)(VideoChat));
