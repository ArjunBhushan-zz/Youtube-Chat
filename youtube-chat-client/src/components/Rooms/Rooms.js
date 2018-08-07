import React from 'react';
import Room from './Room/Room';
import styles from './Rooms.css'
const rooms = (props) => {
  let rooms = props.rooms.map((roomName) => {
    return (
      <Room key = {roomName} name = {roomName}/>
    );
  });
  return (
    <div className = {styles.Rooms}>
      {rooms}
    </div>
  );
};

export default rooms;
