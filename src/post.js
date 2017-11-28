const mongoose = require('mongoose');

// Clear out mongoose's model cache to allow --watch to work for tests:
// https://github.com/Automattic/mongoose/issues/1251
mongoose.models = {};
mongoose.modelSchemas = {};

mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/posts', { useMongoClient: true });

const PostSchema = new mongoose.Schema({
  soID: {
    type: Number,
    required: true,
  },
  parentID: Number,
  url: {
    type: String,
    required: true,
  },
  title: {
    type: String,
  },
  body: {
    type: String,
    required: true,
  },
  tags: [],
  user: {
    soUserID: Number,
    name: String,
    reputation: Number,
  },
  score: {
    type: Number,
    required: true,
  },
  acceptedAnswerID: Number,
});

module.exports = mongoose.model('Posts', PostSchema);
