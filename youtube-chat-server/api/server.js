const express = require('express');
const bodyParser= require('body-parser');
const _ = require('lodash');
const {ObjectId} = require('mongodb');
const bcrypt = require ('bcryptjs');
const {mongoose} = require('./db/mongoose');
const {User} = require('./models/user');
const {authenticate} = require('./middleware/authenticate');

const app = express();
const PORT = process.env.PORT || 6000;

app.use(bodyParser.json());

app.use((req, res, next) => {
  var time = new Date().toString();
  console.log(`${req.method} ${req.url} at ${time}`);
  next();
});

// app.post('/todos', authenticate, (req,res) => {
//   var todo = new Todo ({
//     text: req.body.text,
//     _creator: req.user._id
//   });
//
//   todo.save()
//     .then((doc) => {
//       res.status(200).send(doc);
//     })
//     .catch((err) => {
//       res.status(400).send(err);
//     });
// });
//
// app.get('/todos', authenticate, (req,res) => {
//   Todo.find({
//     _creator: req.user._id
//   }).then((todos) => {
//       res.status(200).send({todos});
//     })
//     .catch((err) => {
//       res.status(400).send(err);
//     });
// });
//
// //GET /todos/
// app.get('/todos/:id', authenticate, (req,res) => {
//   var id = req.params.id;
//
//   if(!ObjectId.isValid(id)){
//     res.status(404).send();
//   }else{
//     Todo.findOne({
//       _id:id,
//       _creator: req.user._id
//     }).then((todo) => {
//         if(!todo){
//           res.status(404).send();
//         }
//         res.status(200).send({todo});
//       })
//       .catch((err) => {
//         res.status(400).send();
//       });
//   }
// });
//
// app.delete('/todos/:id', authenticate,(req, res) => {
//   var id = req.params.id;
//   if (!ObjectId.isValid(id)){
//     res.status(404).send();
//     return;
//   }
//   Todo.findOneAndRemove({
//     _id: id,
//     _creator: req.user._id
//   }).then((todo) => {
//       if(!todo){
//         res.status(404).send();
//         return;
//       }
//       res.status(200).send(todo);
//     })
//     .catch((err) => {
//       res.status(400).send();
//     });
// });
//
// app.patch('/todos/:id', authenticate,(req,res) =>{
//   var id = req.params.id;
//   var body = _.pick(req.body, ['text', 'completed']);
//   if(!ObjectId.isValid(id)){
//     res.status(404).send();
//     return;
//   }
//
//   if(_.isBoolean(body.completed) && body.completed){
//     body.completedAt = new Date().getTime();
//   }else{
//     body.completed = false;
//     body.completedAt = null;
//   }
//
//   Todo.findByIdAndUpdate({_id:id, _creator: req.user._id}, {$set: body}, {new: true})
//     .then((todo) => {
//       if(!todo){
//         res.status(404).send();
//         return;
//       }
//       res.status(200).send({todo});
//     })
//     .catch((err) => {
//       res.status(400).send();
//     });
// });


app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['username', 'password', 'display']);
  var user = new User(body);
  user.save()
    .then(() => {
      return user.generateAuthToken();
    }).then((token) => {
      res.header('x-auth', token).send(user);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
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
        res.header('x-auth', token).send(user);
      });
    }).catch((err) => {
      res.status(404).send();
    });
});

app.delete('/users/me/token', authenticate, (req,res) => {
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
