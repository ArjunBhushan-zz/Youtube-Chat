import React, {Component} from 'react';
import Auxiliary from './../Auxiliary/Auxiliary';
import styles from './Layout.css';
import Toolbar from './../../components/Navigation/Toolbar/Toolbar';
class Layout extends Component {
  render() {
    return (
      <Auxiliary>
        <Toolbar/>
        <main className = {styles.Content}>
          {this.props.children}
        </main>
      </Auxiliary>
    );
  }
}

export default Layout;
