import React from 'react';
import NavigationItem from './NavigationItem/NagivationItem';
import styles from './NavigationItems.css';

const navigationItems = (props) => {
  return (
    <ul className = {styles.NavigationItems}>
      <NavigationItem link = "/" >Home</NavigationItem>
      <NavigationItem link = "/login" >Login</NavigationItem>
    </ul>
  );
};
export default navigationItems;
