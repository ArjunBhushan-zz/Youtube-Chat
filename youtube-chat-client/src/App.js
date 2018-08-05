import React, { Component } from 'react';
import './App.css';
import Layout from './hoc/Layout/Layout';
import {Route, Switch, withRouter, Redirect} from 'react-router-dom';
import VideoChat from './containers/VideoChat/VideoChat';
import Auth from './containers/Auth/Auth';
import Home from './containers/Home/Home';
import Logout from './containers/Auth/Logout/Logout';
class App extends Component {
  render() {
    let routes = (
      <Switch>
        <Route path = "/auth" component = {Auth}/>
        <Route path= "/rooms" component={VideoChat}/>
        <Route path= "/logout" component={Logout}/>
        <Route path = "/" exact component = {Home}/>
        <Redirect to = '/'/>
      </Switch>
    );
    return (
      <Layout>
        {routes}
      </Layout>
    );
  }
}


export default withRouter(App);
