import * as actionTypes from './actionTypes';
import axios from 'axios';

const authStart = () => {
  return {
    type: actionTypes.AUTH_START
  };
};

const authSuccess = (token, username) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    payload: {token, username}
  };
};

const authFail = (error) => {
  return {
    type: actionTypes.AUTH_FAIL,
    payload: {error}
  };
};

const processError = (error) => {
  if (error.response.status === 404) {
    return `Unauthorized Credentials`;
  }else {
    return `Unexpected Error`
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  return {
      type: actionTypes.AUTH_LOGOUT
  };
};

export const auth = (username, password, isSignup, display) => {
  return (dispatch) => {
    dispatch(authStart());
    let url = 'https://youtube-chat-api.herokuapp.com/users';
    if (!isSignup) {
      url = 'https://youtube-chat-api.herokuapp.com/users/login';
      axios.post(url, {
        username,
        password
      })
        .then((res) => {
          const token = res.data.token;
          const username = res.data.username;
          localStorage.setItem('token', token);
          localStorage.setItem('username', username);
          dispatch(authSuccess(token, username));
        })
        .catch((err) => {
          dispatch(authFail(processError(err)));
        });
    }else{
      axios.post(url, {
        username,
        password,
        display
      })
        .then((res) => {
          const token = res.data.token;
          const username = res.data.username;
          localStorage.setItem('token', token);
          localStorage.setItem('username', username);
          dispatch(authSuccess(token, username));
        })
        .catch((err) => {
          dispatch(authFail(processError(err)));
        });
    }
  };
};

export const authCheckState = () => {
  return (dispatch) => {
    const token = localStorage.getItem('token');
    if (!token) {
      dispatch(logout());
    } else {
      const username = localStorage.getItem('username');
      dispatch(authSuccess(token, username));
    }
  };
};
