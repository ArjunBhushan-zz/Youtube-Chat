import React, {Component} from 'react';
import Auxiliary from './../Auxiliary/Auxiliary';
import styles from './Layout.css';

class Layout extends Component {
  render() {
    return (
      <Auxiliary>
        <main className = {styles.Content}>
          {this.props.children}
        </main>
      </Auxiliary>
    );
  }
}

export default Layout;
