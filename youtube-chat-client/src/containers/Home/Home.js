import React, {Component} from 'react';
import styles from './Home.css';
import EnterRoom from './../../components/Rooms/EnterRoom/EnterRoom';
import axios from 'axios';
import Rooms from './../../components/Rooms/Rooms';
import Spinner from './../../components/UI/Spinner/Spinner';
import io from 'socket.io-client';
class Home extends Component {
 state = {
   allRooms: [],
   activeRooms: [],
   error: null,
   showRooms: true,
   loading: true,
   activeLoading: true,
   isMounted: false
 }
 componentDidMount() {
   this.setState({isMounted: true});
   axios.get('https://youtube-chat-api.herokuapp.com/rooms')
    .then((res) => {
      let allRooms = res.data.map((room) => {
        return room.name;
      });
      this.setState({allRooms, error: null, loading: false});
    })
    .catch((err) => {
      this.setState({error: 'Could not get rooms', loading: false});
    });
  let socket = io('http://localhost:8080/');
  if (process.env.PORT) {
    socket = io('https://youtube-chat-socket.herokuapp.com/');
  }
  this.socket = socket;
  socket.on('connect', () => {
    socket.emit('sendRooms');
  });
  socket.on('getRooms', (rooms) => {
    let activeRooms = [];
    if (!rooms){
      return;
    }
    rooms.forEach((room) => {
      if(room.users.length !== 0){
        activeRooms.push(room.name);
      }
    });
    if (this.state.isMounted){
      this.setState({activeRooms, activeLoading: false});
    }
  });
 }
  render() {
    let error = null;
    if (this.state.error) {
      error = (<p className = {styles.Error}> {this.state.error}</p>);
    }
    let rooms = <Spinner/>;
    if (this.state.showRooms && !this.state.loading){
      rooms = <Rooms rooms = {this.state.allRooms}/>;
    }
    let activeRooms = <Spinner/>;
      if (this.state.allRooms && !this.state.activeLoading){
      activeRooms = <Rooms rooms = {this.state.activeRooms}/>;
    }
    return (
      <div className = {styles.Home}>
        {error}
        <h4>Enter Room</h4>
        <EnterRoom/>
        <hr/>
        <h4>Active Rooms</h4>
        {activeRooms}
        <hr/>
        <h4>All Rooms</h4>
        {rooms}
      </div>
    );
  }
}

export default Home;
