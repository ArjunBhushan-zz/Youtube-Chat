import React from 'react';
import Logo from './../../Logo/Logo';
import styles from './Toolbar.css';
import NavigationItems from './../NavigationItems/NavigationItems';
import DrawerToggle from './../SideDrawer/DrawerToggle/DrawerToggle';
const toolbar = (props) => {
  return (
    <header className = {styles.Toolbar}>
      <DrawerToggle clicked = {props.drawerToggleClicked}/>
      <div className = {styles.Logo}>
        <Logo/>
      </div>
      <nav className = {styles.DesktopOnly}>
        <NavigationItems isAuth = {props.isAuth}/>
      </nav>
    </header>
  );
};


export default toolbar;
