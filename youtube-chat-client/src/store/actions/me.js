import * as actionTypes from './actionTypes';
import axios from 'axios';

const meStart = () => {
  return {
    type: actionTypes.ME_START
  };
};

const meSuccess = (display, rooms) => {
  if (rooms){
    return {
      type: actionTypes.ME_SUCCESS,
      payload: {display, rooms}
    };
  }else{
    return {
      type: actionTypes.ME_SUCCESS,
      payload: {display}
    };
  }
};

const meFail = (error) => {
  return {
    type: actionTypes.ME_FAIL,
    payload: {error}
  };
};

export const updateUser = (token, display) => {
  return (dispatch) => {
    if (display.trim().length === 0) {
      return dispatch(meFail('Please enter a valid display name'));
    }
    dispatch(meStart());
    axios({
      method: 'patch',
      url: 'https://youtube-chat-api.herokuapp.com/users/me/',
      headers: {'x-auth': token.toString(), 'Content-Type' : 'application/json'},
      data: {
        display
      }
    })
      .then((res) => {
        dispatch(meSuccess(res.data.display));
      })
      .catch((err) => {
        dispatch(meFail('Could not load user'));
      });
  };
};

const getAllRooms = async (rooms, token) => {
  const promises = [];
  const allRooms = await axios.get('https://youtube-chat-api.herokuapp.com/rooms');
  rooms.forEach((room) => {
    allRooms.data.forEach((names) => {
      if (room._visited === names._id){
        promises.push(axios(
          {
            method: 'get',
            url: `https://youtube-chat-api.herokuapp.com/rooms/${names.name}`,
            headers: {'x-auth': token.toString(), 'Content-Type' : 'application/json'},
          }
        ));
      }
    });
  });
  return promises;
}

export const loadUser = (token) => {
  return (dispatch) => {
    if (!token) {
      return;
    }
    dispatch(meStart());
    axios({
      method: 'get',
      url: 'https://youtube-chat-api.herokuapp.com/users/me',
      headers: {'x-auth': token.toString(), 'Content-Type' : 'application/json'},
    })
      .then((res) => {
        getAllRooms(res.data.visitedRooms, token)
          .then((promises) => {
            Promise.all(promises)
              .then((log) => {
                let rooms = log.map((singleRoom) => {
                  return singleRoom.data.name;
                });
                dispatch(meSuccess(res.data.display, rooms));
              })
              .catch((err) => {
                dispatch(meFail('Could not load rooms'));
              });
          })
          .catch((err) => {
            dispatch(meFail('Could not load rooms'));
          })
      })
      .catch((err) => {
        dispatch(meFail('Could not load user'));
      });
  }
}
