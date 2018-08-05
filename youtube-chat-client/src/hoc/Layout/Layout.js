import React, {Component} from 'react';
import Auxiliary from './../Auxiliary/Auxiliary';
import styles from './Layout.css';
import Toolbar from './../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from './../../components/Navigation/SideDrawer/SideDrawer';
import { connect } from 'react-redux';

class Layout extends Component {
  state = {
    showSideDrawer : false
  }
  sideDrawerClosedHandler = () => {
    this.setState({showSideDrawer: false});
  }
  sideDrawerToggleHandler = () => {
    this.setState((lastState) => {
      return {showSideDrawer: !lastState.showSideDrawer};
    });
  }
  render() {
    return (
      <Auxiliary>
        <Toolbar
          drawerToggleClicked = {this.sideDrawerToggleHandler}
          isAuth = {this.props.isAuth}/>
        <SideDrawer
          open = {this.state.showSideDrawer}
          closed = {this.sideDrawerClosedHandler}
          isAuth = {this.props.isAuth}/>
        <main className = {styles.Content}>
          {this.props.children}
        </main>
      </Auxiliary>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuth: state.auth.token !== null
  };
};

export default connect(mapStateToProps)(Layout);
