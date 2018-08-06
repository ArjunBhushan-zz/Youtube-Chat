import * as actionTypes from './../actions/actionTypes';
import {updateObject} from './../utilities/utilities';

const initialState = {
  display: '',
  rooms: [],
  loading: false,
  error: null
};

const meStart = (state, action) => {
  return updateObject(state, {loading: true, error: null});
};

const meSuccess = (state, action) => {
  return updateObject(state, {...action.payload, loading: false, error: null});
};

const meFail = (state, action) => {
  return updateObject(state, {loading: false, error: action.payload.error});
};

const meReducer = (state = initialState, action) => {
  switch(action.type) {
    case(actionTypes.ME_START): return meStart(state, action);
    case(actionTypes.ME_SUCCESS): return meSuccess(state, action);
    case(actionTypes.ME_FAIL): return meFail(state, action);
    default: return state;
  }
};

export default meReducer;
