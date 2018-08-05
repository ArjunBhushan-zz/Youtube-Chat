require('./../config/config');
var mongoose = require('mongoose');
//sudo mongod --storageEngine=mmapv1 --dbpath mongo-local/
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_Host, {useNewUrlParser: true, autoIndex: false});

module.exports = {
  mongoose
};
