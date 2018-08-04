const http = require('http');
const socketIO = require ('socket.io');
const express = require ('express');

const PORT = process.env.PORT || 8080;

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// {
//   username:,
//   rooms: [ , , , , ,],
//   latency: []
// }
const users = [];

io.on('connection', (socket) => {
  console.log(`[Socket]: New user entered.`);

  socket.on('join', (user) => {
    console.log(`[Socket]: ${user.username} has joined ${user.room}`);
    socket.join(user.room);
  });

  socket.on('unsubscribe', (user) => {
    console.log(`[Socket]: ${user.username} has left ${user.room}`);
    socket.leave(user.room);
  });
  socket.on('timeChange', (user, currTime) => {
    console.log(`[Socket]: Video now at ${currTime}.`);
    socket.broadcast.to(user.room).emit('timeSync', currTime);
  });
  socket.on('urlChange', (user, newUrl) => {
    console.log(`[Socket]: URL has changed to ${newUrl}`);
    socket.broadcast.to(user.room).emit('pauseVideo');
    socket.broadcast.to(user.room).emit('urlSync', newUrl);
  });
  socket.on('pause', (user) => {
    console.log(`[Socket]: Video paused.`);
    socket.broadcast.to(user.room).emit('pauseVideo');
  });
  socket.on('play', (user) => {
    console.log('[Socket]: Video playing again.');
    socket.broadcast.to(user.room).emit('playVideo');
  });
});

server.listen(PORT, () => {
  console.log(`[Socket]: listening on port ${PORT}.`);
});
