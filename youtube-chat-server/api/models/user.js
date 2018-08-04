if(!process.env.PORT){
  require('./../config/config');
}
const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require ('jsonwebtoken');
const _ = require ('lodash');
const bcrypt = require ('bcryptjs');
const UserSchema = new mongoose.Schema (
  {
    username: {
      required: true,
      trim: true,
      type: String,
      minlength: 1,
      unique: true,
    },
    password: {
      type: String,
      require: true,
      minlength: 6
    },
    tokens: [{
      token: {
        type: String,
        required: true
      }
    }],
    visitedRooms : [{
      _visitor: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
      }
    }]
  });

UserSchema.methods.generateAuthToken = function () {
  const user = this;
  let token = jwt.sign({_id: user._id.toHexString()}, process.env.JWT_SECRET).toString();
  user.tokens = user.tokens.concat([{token}]);

  return user.save()
    .then(() => {
      return token;
    })
    .catch((err) => {
      return Promise.reject();
    });
};

UserSchema.methods.toJSON = function () {
  var user = this;
  var userObject = user.toObject();
  return _.pick(userObject, ['_id', 'username']);
};

UserSchema.methods.removeToken = function(token) {
  var user = this;
  return user.update({
    $pull: {
      tokens: {
        token
      }
    }
  });
}
UserSchema.statics.findByToken = function (token) {
 var User = this;
 var decoded;
 try {
   decoded = jwt.verify(token, process.env.JWT_SECRET);
 }catch (err){
   return Promise.reject();
 }
 return User.findOne({
  '_id': decoded._id,
  'tokens.token': token
 });
};

UserSchema.statics.findByCredentials = function (username, password) {
  var User = this;
  return User.findOne({username})
    .then((user) => {
      if(!user){
        return Promise.reject();
      }
      return new Promise((resolve, reject) => {
        bcrypt.compare(password, user.password, (err, res) => {
          if (res) {
            resolve(user);
          }
          reject();
        });
      });
    })
    .catch((err) =>{
      return Promise.reject();
    });
};
UserSchema.pre('save', function(next){
  var user = this;
  if(user.isModified('password')){
    bcrypt.genSalt(10, (err, salt)=> {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  }else{
    next();
  }
});
var User = mongoose.model('User', UserSchema);

module.exports = {
  User
};
