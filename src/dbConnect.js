const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const dbUri = process.env.DB_URI || 'mongodb://localhost/so-posts';

const options = {
  useMongoClient: true
};

const connect = mongoose.connect(
  dbUri,
  options
);

module.exports = connect;
