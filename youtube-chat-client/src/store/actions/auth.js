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

const logoutHandler = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  return {
      type: actionTypes.AUTH_LOGOUT
  };
};

export const logout = () => {
  return (dispatch) => {
    const token = localStorage.getItem('token');
    if (!token){
      return dispatch(logoutHandler());
    }
    console.log(token);
    const url = 'https://youtube-chat-api.herokuapp.com/users/me/token';
    axios({
      url,
      method: 'delete',
      headers: {'x-auth': `${token}`}
    })
      .then((res) => {
        dispatch(logoutHandler());
      })
      .catch((err) => {
        dispatch(logoutHandler());
      });
  }
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
