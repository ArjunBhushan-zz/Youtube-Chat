import React from 'react';

import playerLogo from './../../assets/images/youtube.png';
import styles from './Logo.css';

const logo = (props) => {
  return (
    <div className = {styles.Logo}>
      <img src = {playerLogo} alt = "YoutubePlayer"></img>
    </div>
  );
};

export default logo;
