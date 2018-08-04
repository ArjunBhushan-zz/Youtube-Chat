import React from 'react';
import Logo from './../../Logo/Logo';
import styles from './Toolbar.css';
import NavigationItems from './../NavigationItems/NavigationItems';
const toolbar = (props) => {
  return (
    <header className = {styles.Toolbar}>
      <div className = {styles.Logo}>
        <Logo/>
      </div>
      <nav className = {styles.DesktopOnly}>
        <NavigationItems/>
      </nav>
    </header>
  );
};


export default toolbar;
