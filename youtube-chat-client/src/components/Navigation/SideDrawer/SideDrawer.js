import React from 'react';
import Logo from './../../Logo/Logo';
import NavigationItems from './../NavigationItems/NavigationItems';
import Backdrop from './../../UI/Backdrop/Backdrop';
import Auxiliary from './../../../hoc/Auxiliary/Auxiliary';
import styles from './SideDrawer.css';

const sideDrawer = (props) => {
  let attachedClasses = [styles.SideDrawer, styles.Close];
  if (props.open){
    attachedClasses = [styles.SideDrawer, styles.Open]
  }
  return (
    <Auxiliary>
      <Backdrop show={props.open} clicked = {props.closed}/>
      <div className = {attachedClasses.join(' ')} onClick = {props.closed}>
        <div className = {styles.Logo}>
          <Logo/>
        </div>
        <nav className = {attachedClasses.join(' ')}>
          <NavigationItems isAuth = {props.isAuth}/>
        </nav>
      </div>
    </Auxiliary>
  );
};
export default sideDrawer;
