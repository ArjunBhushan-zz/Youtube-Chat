require('./../config/config');
var mongoose = require('mongoose');
console.log(process.env.DB_Host);
//sudo mongod --storageEngine=mmapv1 --dbpath mongo-local/
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_Host);

module.exports = {
  mongoose
};
