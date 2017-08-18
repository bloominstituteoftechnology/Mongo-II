const mongoose = require('mongoose');
// Clear out mongoose's model cache to allow --watch to work for tests:
// https://github.com/Automattic/mongoose/issues/1251
mongoose.models = {};
mongoose.modelSchemas = {};

mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/so-posts', { useMongoClient: true });

const PostSchema = new mongoose.Schema({
  // TODO: write your schema here
  soID: {
    type: Number,
    required: true,
    // unique: true,
  },
  parentID: {
    type: Number,
    // default: null,
  },
  url: {
    type: String,
    // required: true,
  },
  title: {
    type: String,
    // required: true,
  },
  body: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  tags: {
    type: [
      String
    ]
  },
  acceptedAnswerID: {
    type: Number,
    default: null
  },
  user: {
    soUserID: Number,
    name: String,
    reputation: Number,
  },
});

module.exports = mongoose.model('Posts', PostSchema);
