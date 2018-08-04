import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import {BrowserRouter} from 'react-router-dom';
// import { Provider } from 'react-redux';
// import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
// import thunk from 'redux-thunk';
//
// const composeEnhancers = process.env.NODE_ENV === 'development' ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : null || compose;
//
// const rootReducer = combineReducers({
//   player: playerReducer
// });
//
// const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));

const app = (
  <div>
    {/*<Provider store = {store}>*/}
      <BrowserRouter>
        <App/>
      </BrowserRouter>
    {/*</Provider>*/}
  </div>
);

ReactDOM.render(app, document.getElementById('root'));
registerServiceWorker();
