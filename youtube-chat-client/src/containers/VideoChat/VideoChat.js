import React, {Component} from 'react';
import Player from './../../components/Player/Player';
import { withRouter, Redirect } from 'react-router-dom';
import queryString from 'query-string';
import axios from 'axios';
import { connect } from 'react-redux';

class VideoChat extends Component {
  componentDidMount() {
    const room = queryString.parse(this.props.location.search).room;
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
    const room = queryString.parse(this.props.location.search).room;
    let sockets = (
      <Player room = {room}/>
    );
    if (!room) {
      sockets = <Redirect to= "/"/>;
    }
    return (
      <div>
        {sockets}
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
