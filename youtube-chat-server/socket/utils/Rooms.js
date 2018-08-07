class Rooms {
  constructor () {
    this.rooms = [];
  }
  isRoom(roomName){
    let roomIndex = -1;
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
  addUser(username, room) {
    let index = this.isRoom(room);
    if (index === -1) {
      return;
    }else{
      let tempRooms = [...this.rooms];
      tempRooms[index].users.push(username);
      this.room = tempRooms;
    }
  }
  removeUser(username, room) {
    let indexRoom = this.isRoom(room);
    if (indexRoom === -1) {
      return;
    }else{
      let tempRooms = [...this.rooms];
      if (tempRooms[indexRoom].users.indexOf(username) === -1){
        return;
      }else {
        tempRooms[indexRoom].users.splice(tempRooms[indexRoom].users.indexOf(username), 1);
        this.rooms = tempRooms;
      }
    }
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

// const rooms = new Rooms();
// rooms.addRoom('squad', 5);
// rooms.removeRoom('squad');
// rooms.addRoom('test', 4);
// rooms.addUser('arjun', 'test');
// rooms.addUser('brian', 'test');
// rooms.removeUser('brian', 'test');
// rooms.addUser('dowson', 'test');
// rooms.updateLatency('test', 5);
// rooms.updateLatency('test', 6);
// rooms.updateLatency('test', 7);
// rooms.updateLatency('test', 8);
// rooms.updateLatency('test', 9);
// console.log(rooms.rooms);
