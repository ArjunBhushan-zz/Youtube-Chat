const axios = require ('axios');

class Rooms {
  constructor () {
    axios.get('https://youtube-chat-api.herokuapp.com/rooms')
      .then((storedRooms) => {
        let rooms = storedRooms.data.map((storedRoom) => {
          return {
            name: storedRoom.name,
            latency: [],
            users: []
          };
        });
        this.rooms = rooms;
      })
      .catch((err) => {
        this.rooms = [];
      });
  }
  isRoom(roomName){
    let roomIndex = -1;
    if (!this.rooms){
      return roomIndex;
    }
    this.rooms.forEach((room, index) => {
      if (room.name=== roomName){
        roomIndex = index;
      }
    });
    return roomIndex;
  }
  addRoom(room) {
    if (this.isRoom(room) !== -1) {
      return;
    }else{
      if (!this.rooms){
        this.rooms = [];
      }
      this.rooms = this.rooms.concat({
        name: room,
        latency: [],
        users: []
      });
    }
  }
  updateLatency(room, latency) {
    let index = this.isRoom(room);
    if (index === -1) {
      return;
    }else{
      let tempRooms = [...this.rooms];
      tempRooms[index].latency.push(latency);
      this.rooms = tempRooms;
    }
  }
  calculateLatency(room) {
    let index = this.isRoom(room);
    if (index === -1) {
      return 0;
    }else{
      let averageLatency = 0;
      const tempRooms = [...this.rooms];
      let length = tempRooms[index].latency.length;
      if (length < 5){
        for (let i=0; i<length; i++){
          averageLatency = averageLatency + tempRooms[index].latency[i];
          if (i === length - 1){
            averageLatency = averageLatency/length;
            return averageLatency;
          }
        }
      }else{
        for (let i=length-5; i<length; i++){
          averageLatency = averageLatency + tempRooms[index].latency[i];
          if (i === length - 1){
            averageLatency = averageLatency/5;
            return averageLatency;
          }
        }
      }
    }
    return 0;
  }
  removeRoom(room){
    let index = this.isRoom(room);
    if (index === -1) {
      return;
    }else{
      let tempRooms = [...this.rooms];
      tempRooms.splice(index,1);
      this.rooms = tempRooms;
    }
  }
  addUser(username, room, socketId) {
    let index = this.isRoom(room);
    if (index === -1) {
      return;
    }else{
      let tempRooms = [...this.rooms];
      let duplicate = false;
      tempRooms[index].users.forEach((user) => {
        if (user.username === username) {
          duplicate = true;
        }
      });
      if (duplicate){
        return;
      }
      tempRooms[index].users.push({username, socketId});
      this.room = tempRooms;
    }
  }
  removeUser(username, room, socketId) {
    let indexRoom = this.isRoom(room);
    if (indexRoom === -1) {
      return;
    }else{
      let tempRooms = [...this.rooms];
      tempRooms[indexRoom].users.forEach((user, indexUser) =>{
        if (user.socketId ===  socketId) {
          tempRooms[indexRoom].users.splice(indexUser, 1);
          this.rooms = tempRooms;
        }
      });
      return;
    }
  }
  allSockets(){
    if (!this.rooms) {
      this.rooms = [];
    }
    let sockets = [];
    this.rooms.forEach((room) => {
      room.users.forEach((user) => {
        sockets.push(user.socketId);
      });
    });
    return sockets;
  }
  removeUserBySocketId(socketId) {
    this.rooms.forEach((room, indexRoom) => {
      room.users.forEach((user, indexUser) => {
        if (user.socketId === socketId){
          let tempRooms = [...this.rooms];
          tempRooms[indexRoom].users.splice(indexUser, 1);
        }
      });
    });
  }
  getUsers(room) {
    let index = this.isRoom(room);
    if(index === -1) {
      return;
    }else{
      return this.rooms[index].users;
    }
  }
}

module.exports = {
  Rooms
};
