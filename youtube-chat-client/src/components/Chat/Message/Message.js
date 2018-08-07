import React from 'react';
import styles from './Message.css';

const message = (props) => {
  let date = new Date(props.date);
  return (
    <div className = {styles.Message}>
      <div className = {styles.Title}>
        <h4>{props.display}</h4>
        <span>{date.toTimeString().slice(0,8)}</span>
      </div>
      <div className = {styles.Body}>
        <p>{props.text}</p>
      </div>
    </div>
  );
}

export default message;
