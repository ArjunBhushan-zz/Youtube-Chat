const http = require('http');
const express = require ('express');

const PORT = process.env.PORT || 8080;
const {Sockets} = require('./utils/Sockets');
const {Rooms} = require('./utils/Rooms');
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, {'pingInterval': 2000, 'pingTimeout': 5000});
const axios = require('axios');
const qs = require('qs');

let sockets = new Sockets();
let rooms = new Rooms();
let getLatency = [];

io.on('connection', (socket) => {
  socket.on('join', (user) => {
    let roomName  = qs.parse(user.room);
    user.room = Object.keys(roomName)[0];
    socket.join(user.room);
    sockets.addSocket(socket.id, user.username, user.room);
    if(rooms.isRoom(user.room) === -1){
      rooms.addRoom(user.room);
      rooms.addUser(user.username, user.room, socket.id);
    }else{
      if (rooms.rooms[rooms.isRoom(user.room)].url) {
        socket.to(user.room).emit('urlSync', rooms.rooms[rooms.isRoom(user.room)].url);
      }
      rooms.addUser(user.username, user.room, socket.id);
    }
    io.emit('getRooms', rooms.rooms);
  });

  socket.on('unsubscribe', (user) => {
    let roomName  = qs.parse(user.room);
    user.room = Object.keys(roomName)[0];
    rooms.removeUser(user.username, user.room, socket.id);
    sockets.removeSocketById(socket.id);
    if (getLatency.indexOf(socket.id) !== -1) {
      getLatency.splice(getLatency.indexOf(socket.id), 1);
    }
    io.emit('getRooms', rooms.rooms);
    socket.leave(user.room);
  });
  socket.on('disconnect', () => {
    let username = sockets.getUsername(socket.id);
    let room = null;
    if (sockets.isSocketById(socket.id) !== -1){
      room = sockets.sockets[sockets.isSocketById(socket.id)].room
    }
    let roomName  = qs.parse(room);
    room = Object.keys(roomName)[0];
    if (username && room){
      rooms.removeUser(username, room, socket.id);
    }
    sockets.removeSocketById(socket.id);
    if (getLatency.indexOf(socket.id) !== -1) {
      getLatency.splice(getLatency.indexOf(socket.id), 1);
    }
    io.emit('getRooms', rooms.rooms);
    socket.leave(room);
  });


  socket.on('roomDeleted', (user) => {
    let roomName  = qs.parse(user.room);
    user.room = Object.keys(roomName)[0];
    rooms.removeRoom(user.room);
    socket.broadcast.to(user.room).emit('roomDisbanded');
    io.emit('getRooms', rooms.rooms);
  });

  socket.on('timeChange', (user, currTime) => {
    let roomName  = qs.parse(user.room);
    user.room = Object.keys(roomName)[0];
    //console.log(`[Socket]: Video now at ${currTime}.`);
    socket.broadcast.to(user.room).emit('timeSync', currTime + (rooms.calculateLatency(user.room) + 135)/1000, sockets.sockets);
    let currentTime = Date.now();
    socket.emit('setLatency', () => {
      rooms.updateLatency(user.room, (Date.now() - currentTime)/2);
    });
    sockets.getSocketsByRoom(rooms, user.room)
      .forEach((socketId) => {
        if (getLatency.indexOf(socketId) === -1) {
          getLatency = getLatency.concat(socketId);
        }
      });
  });

  socket.on('updateLatency', (user) => {
    let roomName  = qs.parse(user.room);
    user.room = Object.keys(roomName)[0];
    if (getLatency.indexOf(socket.id) !== -1){
      let currentTime = Date.now();
      socket.emit('setLatency', () => {
        sockets.updateLatency(user.username, user.room, (Date.now() - currentTime)/2);
      });
    }
  });

  socket.on('urlChange', (user, newUrl) => {
    let roomName  = qs.parse(user.room);
    user.room = Object.keys(roomName)[0];
    if (rooms.rooms[rooms.isRoom(user.room)]){
      rooms.rooms[rooms.isRoom(user.room)].url = newUrl;
    }
    //console.log(`[Socket]: URL has changed to ${newUrl}`);
    socket.broadcast.to(user.room).emit('pauseVideo');
    socket.broadcast.to(user.room).emit('urlSync', newUrl);
  });

  socket.on('pause', (user) => {
    let roomName  = qs.parse(user.room);
    user.room = Object.keys(roomName)[0];
    //console.log(`[Socket]: Video paused.`);
    socket.broadcast.to(user.room).emit('pauseVideo');
  });

  socket.on('play', (user) => {
    let roomName  = qs.parse(user.room);
    user.room = Object.keys(roomName)[0];
    //console.log('[Socket]: Video playing again.');
    socket.broadcast.to(user.room).emit('playVideo');
  });

  socket.on('createMessage', (user, text) => {
    let roomName  = qs.parse(user.room);
    user.room = Object.keys(roomName)[0];
    let date = Date.now();
    let display = 'Anonymous';
    if (user.username) {
      display = user.username;
    }
    if (user.display){
      display = user.display;
    }
    io.to(user.room).emit('newMessage', {
      date,
      text,
      display
    });
    if (user.token) {
      axios({
        method: 'post',
        url: `https://youtube-chat-api.herokuapp.com/rooms/message/${user.room}`,
        headers: {'x-auth': user.token},
        data: {
          text
        }
      })
        .catch((err) => {
          console.log(err);
        });
    }
  });
  socket.on('sendRooms', () => {
    let allSockets = Object.keys(io.sockets.sockets);
    rooms.allSockets().forEach((socketId) => {
      if(allSockets.indexOf(socketId) === -1) {
        rooms.removeUserBySocketId(socketId);
        sockets.removeSocketById(socketId);
      }
    });
    io.emit('getRooms', rooms.rooms);
  });
});

server.listen(PORT, () => {
  //console.log(`[Socket]: listening on port ${PORT}.`);
});
