class Rooms {
  constructor () {
    this.rooms = [];
  }
  isRoom(room){
    return this.rooms.find((chat) => chat.room === room);
  }
  addUser (name, room) {
    var chat = this.isRoom(room);
    if(chat){
      this.rooms[this.rooms.indexOf(chat)].users.push(name);
    }else{
      this.rooms.push({
        room,
        users: [name]
      });
    }
  }
  removeRoom(room){
    this.rooms.splice(this.rooms.indexOf(this.isRoom(room)),1);
  }
  removeUser(name, room) {
    var chat = this.isRoom(room);
    if (!chat){
      return;
    }
    var index = chat.users.indexOf(name);
    if (index === -1){
      return;
    }
    this.rooms[this.rooms.indexOf(chat)].users.splice(index,1);
    if(this.rooms[this.rooms.indexOf(chat)].users.length === 0){
      this.removeRoom(room);
    }
  }
}

module.exports = {
  Rooms
};
