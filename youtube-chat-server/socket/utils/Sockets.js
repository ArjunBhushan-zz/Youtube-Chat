const {Rooms} = require ('./Rooms');

class Sockets {
  constructor () {
    this.sockets = [];
  }
  addSocket (socketId, username) {
    this.sockets = this.sockets.concat({
      socketId,
      username,
      latency: []
    });
  }
  isSocket(username) {
    let roomIndex = -1;
    this.sockets.forEach((socket, index) => {
      if (socket.username === username){
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
  removeSocket(username){
    if(this.isSocket(username) === -1){
      return;
    }else{
      let newSockets = [...this.sockets];
      newSockets.splice(this.isSocket(username),1);
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
  updateLatency(username, latency) {
    let index = this.isSocket(username);
    if (index === -1) {
      return;
    }else{
      let tempSockets = [...this.sockets];
      tempSockets[index].latency.push(latency);
      this.sockets = tempSockets;
    }
  }

  calculateLatency(username) {
    let index = this.isSocket(username);
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

// const rooms = new Rooms();
// const sockets = new Sockets();
// rooms.addRoom('squad', 5);
// rooms.addUser('arjun', 'squad');
// rooms.addUser('brian', 'squad');
// rooms.addRoom('test', 4);
// rooms.addUser('dowson', 'test');
// rooms.addUser('kevin', 'test');
// rooms.removeUser('brian', 'test');
// rooms.updateLatency('test', 5);
// rooms.updateLatency('test', 6);
// rooms.updateLatency('test', 7);
// rooms.updateLatency('test', 8);
// rooms.updateLatency('test', 9);
// //console.log(rooms.rooms);
//
//
// sockets.addSocket(12321412, 'arjun');
// sockets.addSocket(123224112, 'brian');
// sockets.updateLatency('arjun', 5);
// sockets.updateLatency('brian', 9);
// sockets.updateLatency('arjun', 6);
// sockets.updateLatency('brian', 7);
// sockets.updateLatency('arjun', 8);
// sockets.updateLatency('arjun', 5);
// sockets.updateLatency('brian', 9);
// sockets.updateLatency('arjun', 6);
// sockets.updateLatency('brian', 7);
// sockets.updateLatency('arjun', 8);
// // sockets.removeSocket('brian');
// // console.log(sockets.sockets);
// // console.log(sockets.calculateLatency('brian'));
// // console.log(sockets.getUsername(null));
// //console.log(sockets.getAllSockets(rooms.rooms));
// console.log(sockets.getSocketsByRoom(rooms, 'test'));
