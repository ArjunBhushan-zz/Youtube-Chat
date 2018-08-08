const express = require('express');
const bodyParser= require('body-parser');
const _ = require('lodash');
const {ObjectId} = require('mongodb');
const bcrypt = require ('bcryptjs');
const {mongoose} = require('./db/mongoose');
const {User} = require('./models/user');
const {Room} = require('./models/room');
const {Message} = require('./models/message');
const {authenticate} = require('./middleware/authenticate');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 6000;

app.use(bodyParser.json());
app.use(cors());

app.use((req, res, next) => {
  const time = new Date().toString();
  console.log(`${req.method} ${req.url} at ${time}`);
  next();
});

app.post('/rooms', authenticate, (req,res) => {
  const body = _.pick(req.body, ['name']);
  body._owner = req.user._id;
  const room = new Room(body);
  room.save()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

app.get('/rooms', (req,res) => {
  Room.find({})
    .then((rooms) => {
      let pickedRooms = [];
      rooms.forEach((room) => {
        pickedRooms.push(_.pick(room, ['name', '_owner', '_id']));
      });
      res.send(pickedRooms);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

app.get('/rooms/:roomName', (req, res) => {
  const roomName = req.params.roomName;
  Room.findOne({name: roomName})
    .then((room) => {
      if (!room) {
        return res.status(404).send();
      }
      res.send(room);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

app.get('/users/user/:id', (req,res) => {
  const userId = req.params.id;
  User.findById(userId)
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      res.status(404).send();
    });
});

app.get('/messages/:id', (req,res) => {
  const messageId = req.params.id;
  Message.findById(messageId)
    .then((message) => {
      res.send(message);
    })
    .catch((err) => {
      res.status(404).send();
    });
});

app.post('/rooms/message/:roomName', authenticate, (req, res) => {
  const roomName = req.params.roomName;
  const body = _.pick(req.body, ['text']);
  body._user = req.user._id;
  const message = new Message(body);
  message.save()
    .then(() => {
      Room.findOne({name: roomName})
        .then((room) => {
          if (!room) {
            return res.status(404).send();
          }
          room.messages = room.messages.concat({_message: message._id});
          room.save()
            .then(() => {
              res.send();
            })
            .catch((err) => {
              res.status(400).send(err);
            });
        })
        .catch((err) => {
          res.status(400).send(err);
        });
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

app.post('/rooms/user/:roomName', authenticate, (req, res) => {
  const roomName = req.params.roomName;
  Room.findOne({name: roomName})
    .then((room) => {
      if (!room) {
        res.status(404).send();
      }
      let unique = true;
      room.visitedUsers.forEach((user) => {
        if (user._user.toString() === req.user.id.toString()) {
          unique = false;
        }
      });
      if (unique) {
        room.visitedUsers = room.visitedUsers.concat({_user: req.user.id});
        room.save()
          .then(() => {
            res.send();
          })
          .catch((err) => {
            res.status(400).send();
          });
      }else{
        res.send();
      }
    })
    .catch((err) => {
      res.status(400).send(err);
    })
});

app.delete('/rooms/:roomName', authenticate, (req, res) => {
  const roomName = req.params.roomName;
  Room.findOne({name: roomName})
    .then((room) => {
      if(!room){
        return res.status(404).send();
      }
      if (room._owner.toString() !== req.user._id.toString()) {
        return res.status(401).send();
      }
      Room.findOneAndRemove({name: roomName})
        .then((room) => {
          if (!room) {
            return res.status(404).send();
          }
          res.send(room);
        })
        .catch((err) => {
          res.status(400).send(err);
        });
    })
    .catch((err) => {
      res.status(400).send(err);
    })
});


app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['username', 'password', 'display']);
  if (!body.display) {
    body = _.pick(body, ['username', 'password']);
    body.display = body.username;
  }
  var user = new User(body);
  User.findOne({username: body.username})
    .then((duplicate) => {
      if (duplicate) {
        res.status(401).send();
      }else{
        user.save()
          .then(() => {
            return user.generateAuthToken();
          }).then((token) => {
            let data = JSON.stringify(user, undefined, 2);
            res.header('x-auth', token).send({...JSON.parse(data), token});
          })
          .catch((err) => {
            res.status(400).send(err);
          });
      }
    })
    .catch((err) => {
      res.status(400).send(err);
    })
});

app.patch('/users/me/', authenticate, (req,res) =>{
  const id = req.user.id;
  const body = _.pick(req.body, ['display', 'password', 'visitedRoom']);
  User.findById(id)
    .then((user) => {
      if (body.password) {
        user.password = body.password;
      }
      if (body.display) {
        user.display = body.display;
      }
      if (body.visitedRoom) {
        let uniqueRoom = true;
        user.visitedRooms.forEach((room) => {
          if (room._visited == body.visitedRoom._visited){
            uniqueRoom = false;
          }
        });
        if (uniqueRoom) {
          user.visitedRooms = user.visitedRooms.concat(body.visitedRoom);
        }
      }
      user.save()
        .then((data) => {
          res.send(data);
        })
        .catch((err) => {
          res.status(400).send(err);
        })
    })
    .catch((err) => {
      res.status(404).send(err);
    });
});

app.get('/users/me', authenticate, (req,res) => {
  res.send(req.user);
});

app.post('/users/login', (req, res) => {
  var login = _.pick(req.body, ['username', 'password']);
  User.findByCredentials(login.username, login.password)
    .then((user) => {
      return user.generateAuthToken().then((token) => {
        let data = JSON.stringify(user, undefined, 2);
        res.header('x-auth', token).send({...JSON.parse(data), token});
      });
    }).catch((err) => {
      res.status(404).send();
    });
});

app.delete('/users/me/token', authenticate, (req,res) => {
  console.log(req.token);
  req.user.removeToken(req.token)
    .then(() => {
      res.status(200).send();
    }).catch(() => {
      res.status(400).send();
    });
});

app.delete('/users/me/', authenticate, (req,res) => {
  User.findByIdAndDelete(req.user.id)
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      res.status(404).send();
    });
});

app.get('/users', (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      res.status(400).send();
    })
});

app.get('/users/:username', (req, res) => {
  const username = req.params.username;
  User.find({username})
    .then((user) => {
      if (user.length === 0) {
        res.status(404).send();
      }else{
        res.send(user);
      }
    })
    .catch((err) => {
      res.status(400).send();
    })
});

app.listen(PORT, () => {
  console.log(`Started on port ${PORT}`);
});
