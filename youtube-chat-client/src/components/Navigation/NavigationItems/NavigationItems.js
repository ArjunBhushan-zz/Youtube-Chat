import React, {Component} from 'react';
import NavigationItem from './NavigationItem/NagivationItem';
import styles from './NavigationItems.css';

const navigationItems  = (props) => {
  return (
    <ul className = {styles.NavigationItems}>
      <NavigationItem link = "/" >Home</NavigationItem>
      {props.isAuth ? <NavigationItem link = "/rooms">Rooms</NavigationItem> : null}
      {props.isAuth ? <NavigationItem link = "/logout">Logout</NavigationItem> : <NavigationItem link = "/auth">Login</NavigationItem>}
    </ul>
  );
};


export default navigationItems;
