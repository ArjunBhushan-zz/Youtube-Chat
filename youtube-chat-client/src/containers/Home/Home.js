import React, {Component} from 'react';
import styles from './Home.css';
import EnterRoom from './../../components/Rooms/EnterRoom/EnterRoom';
import axios from 'axios';
import Rooms from './../../components/Rooms/Rooms';
import Spinner from './../../components/UI/Spinner/Spinner';
class Home extends Component {
 state = {
   allRooms: [],
   error: null,
   showRooms: true,
   loading: true
 }
 componentDidMount() {
   axios.get('https://youtube-chat-api.herokuapp.com/rooms')
    .then((res) => {
      let allRooms = res.data.map((room) => {
        return room.name;
      });
      this.setState({allRooms, error: null, loading: false});
    })
    .catch((err) => {
      this.setState({error: 'Could not get rooms', loading: false});
    })
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
    return (
      <div className = {styles.Home}>
        {error}
        <h4>Enter Room</h4>
        <EnterRoom/>
        <hr/>
        <h4>All Rooms</h4>
        {rooms}
      </div>
    );
  }
}

export default Home;
