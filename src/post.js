const mongoose = require('mongoose');

// Clear out mongoose's model cache to allow --watch to work for tests:
// https://github.com/Automattic/mongoose/issues/1251
mongoose.models = {};
mongoose.modelSchemas = {};

mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/so-posts', { useMongoClient: true });

// User Schema
// const UserSchema = new mongoose.Schema({
//   soUserID: Number,
//   name: String,
//   reputation: Number
// });

// const Users = mongoose.model('Users', UserSchema);

// Post Schema
const PostSchema = new mongoose.Schema({
  soID: {
    type: Number,
    required: true
  },
  parentID: Number,
  url: {
    type: String,
    required: true
  },
  title: String,
  body: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  tags: [],
  acceptedAnswerID: Number,
  user: {
    soUserID: Number,
    name: String,
    reputation: Number
  }
});

module.exports = mongoose.model('Posts', PostSchema);
