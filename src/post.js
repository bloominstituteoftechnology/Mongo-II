const mongoose = require('mongoose');

// Clear out mongoose's model cache to allow --watch to work for tests:
// https://github.com/Automattic/mongoose/issues/1251
mongoose.models = {};
mongoose.modelSchemas = {};

mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/so-posts', { useMongoClient: true });

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
    required: false,
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
    type: [String],
    required: false,
  },
  acceptedAnswerID: {
    type: Number,
    required: false,
  },
  user: {
    soUserID: Number,
    name: String,
    reputation: Number,
  },
});

module.exports = mongoose.model('Posts', PostSchema);
