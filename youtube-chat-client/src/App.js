import React, { Component } from 'react';
import './App.css';
import Layout from './hoc/Layout/Layout';
import {Route, Switch, withRouter, Redirect} from 'react-router-dom';
import VideoChat from './containers/VideoChat/VideoChat';
import Auth from './containers/Auth/Auth';
import Home from './containers/Home/Home';
import Logout from './containers/Auth/Logout/Logout';
import Me from './containers/Me/Me';
import { connect } from 'react-redux';
import * as actions from './store/actions/index';

class App extends Component {
  componentDidMount() {
    this.props.checkState();
  }
  render() {
    let routes = (
      <Switch>
        <Route path = "/auth" component = {Auth}/>
        <Route path= "/rooms" component={VideoChat}/>
        <Route path = "/" exact component = {Home}/>
        <Redirect to = '/'/>
      </Switch>
    );

    if (this.props.auth) {
      routes = (
        <Switch>
          <Route path = "/auth" component = {Auth}/>
          <Route path= "/rooms" component={VideoChat}/>
          <Route path= "/me" component = {Me}/>
          <Route path= "/logout" component={Logout}/>
          <Route path = "/" exact component = {Home}/>
          <Redirect to = '/'/>
        </Switch>
      );
    }
    return (
      <Layout>
        {routes}
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth.token !== ''
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    checkState: () => dispatch(actions.authCheckState())
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
