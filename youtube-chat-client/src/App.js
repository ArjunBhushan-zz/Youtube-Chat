import React, { Component } from 'react';
import './App.css';
import Layout from './hoc/Layout/Layout';
import {Route, Switch, withRouter, Redirect} from 'react-router-dom';
import VideoChat from './containers/VideoChat/VideoChat';

class App extends Component {
  render() {
    let routes = (
      <Switch>
        <Route path= "/" exact component={VideoChat}/>
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
