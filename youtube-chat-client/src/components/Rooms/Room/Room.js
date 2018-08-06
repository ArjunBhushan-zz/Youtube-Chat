import React from 'react';
import styles from './Room.css';
import {Link} from 'react-router-dom';
const room = (props) => {
  return (
    <Link to={`/rooms?room=${props.name}`} className = {styles.Room}>{props.name}</Link>
  );
};


export default room;
