import * as actionTypes from './../actions/actionTypes';
import {updateObject} from './../utilities/utilities';
const initialState = {
  token: null,
  username: null,
  error: null,
  loading: false
};

const authStart = (state, action) => {
  return updateObject(state, {error: null, loading: true});
};

const authSuccess = (state, action) => {
  return updateObject(state, {
    token: action.payload.token,
    username: action.payload.username,
    error: null,
    loading: false});
};

const authLogout = (state, action) => {
  return updateObject(state, {
    token: null,
    username: null
  });
};

const authFail = (state, action) => {
  return updateObject(state, {error: action.payload.error, loading: false});
};


const reducer = (state = initialState, action) => {
  switch(action.type) {
    case (actionTypes.AUTH_START) : return authStart(state, action);
    case (actionTypes.AUTH_SUCCESS) : return authSuccess(state, action);
    case (actionTypes.AUTH_FAIL) : return authFail(state, action);
    case (actionTypes.AUTH_LOGOUT) : return authLogout(state, action);
    default: return state;
  }
};

export default reducer;
