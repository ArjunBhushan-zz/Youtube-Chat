import React from 'react';
import NavigationItem from './NavigationItem/NagivationItem';
import styles from './NavigationItems.css';
import {withRouter} from 'react-router-dom';
const navigationItems  = (props) => {
  return (
    <ul className = {styles.NavigationItems}>
      <NavigationItem link = "/" >Home</NavigationItem>
      {props.location.pathname.includes('/rooms')? <NavigationItem link = "/rooms">Room</NavigationItem> : null}
      {props.isAuth ? <NavigationItem link = "/me">Me</NavigationItem> : null}
      {props.isAuth ? <NavigationItem link = "/logout">Logout</NavigationItem> : <NavigationItem link = "/auth">Login</NavigationItem>}
    </ul>
  );
};


export default withRouter(navigationItems);
