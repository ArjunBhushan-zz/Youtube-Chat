const {Rooms} = require ('./Rooms');

class Sockets {
  constructor () {
    this.sockets = [];
  }
  addSocket (socketId, username, room) {
    this.sockets = this.sockets.concat({
      socketId,
      username,
      room,
      latency: []
    });
  }
  isSocket(username, room) {
    let roomIndex = -1;
    this.sockets.forEach((socket, index) => {
      if (socket.username === username && socket.room === room){
        roomIndex = index;
      }
    });
    return roomIndex;
  }
  isSocketById(socketId) {
    let roomIndex = -1;
    this.sockets.forEach((socket, index) => {
      if (socket.socketId === socketId){
        roomIndex = index;
      }
    });
    return roomIndex;
  }
  removeSocket(username, room){
    if(this.isSocket(username, room) === -1){
      return;
    }else{
      let newSockets = [...this.sockets];
      newSockets.splice(this.isSocket(username, room),1);
      this.sockets = newSockets;
    }
  }
  removeSocketById(socketId){
    if(this.isSocketById(socketId) === -1){
      return;
    }else{
      let newSockets = [...this.sockets];
      newSockets.splice(this.isSocketById(socketId),1);
      this.sockets = newSockets;
    }
  }
  updateLatency(username, room, latency) {
    let index = this.isSocket(username, room);
    if (index === -1) {
      return;
    }else{
      let tempSockets = [...this.sockets];
      tempSockets[index].latency.push(latency);
      this.sockets = tempSockets;
    }
  }

  calculateLatency(username, room) {
    let index = this.isSocket(username, room);
    if (index === -1) {
      return 0;
    }else{
      let averageLatency = 0;
      const tempSockets = [...this.sockets];
      let length = tempSockets[index].latency.length;
      if (length < 5){
        for (let i=0; i<length; i++){
          averageLatency = averageLatency + tempSockets[index].latency[i];
          if (i === length - 1){
            averageLatency = averageLatency/length;
            return averageLatency;
          }
        }
      }else{
        for (let i=length-5; i<length; i++){
          averageLatency = averageLatency + tempSockets[index].latency[i];
          if (i === length - 1){
            averageLatency = averageLatency/5;
            return averageLatency;
          }
        }
      }
    }
    return 0;
  }
  getUsername(socketId) {
    let username = null;
    this.sockets.forEach((socket) => {
      if (socket.socketId === socketId) {
        username = socket.username;
      }
    });
    return username;
  }
  getSocketId(username) {
    let socketId = null;
    this.sockets.forEach((socket) => {
      if (socket.username === username) {
        socketId = socket.socketId;
      }
    });
    return socketId;
  }
  getAllSockets (rooms) {
    let foundUsers = [];
    rooms.forEach((room) => {
      room.users.forEach((username) => {
        foundUsers.push(username);
      });
    });
    let foundSockets = [];
    foundUsers.forEach((username) => {
      let socketId = this.getSocketId(username);
      if (socketId) {
        foundSockets = foundSockets.concat(socketId);
      }
    });
    return foundSockets;
  }
  getSocketsByRoom (rooms, roomName) {
    let usernames = rooms.getUsers(roomName);
    let foundSockets = [];
    if (!usernames) {
      return foundSockets;
    }else {
      usernames.forEach((username) => {
        if (this.getSocketId(username)) {
          foundSockets = foundSockets.concat(this.getSocketId(username));
        }
      });
    }
    return foundSockets;
  }
}

module.exports = {
  Sockets
};
