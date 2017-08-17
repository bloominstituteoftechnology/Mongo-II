const mongoose = require('mongoose');

// Clear out mongoose's model cache to allow --watch to work for tests:
// https://github.com/Automattic/mongoose/issues/1251
mongoose.models = {};
mongoose.modelSchemas = {};

mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/so-posts', { useMongoClient: true });

const PostSchema = new mongoose.Schema({
  // TODO: write your schema here
  soID: Number,
  parentID: {
    type: Number,
    default: null,
  },
  url: {
    type: String,
    // default: `https://stackoverflow.com/q/${soID}`,
  },
  title: String,
  body: String,
  score: Number,
  tags: Array,
  acceptedAnswerID: {
    type: Number,
    default: null,
  },
  user: {
    soUserID: Number,
    name: String,
    reputation: Number,
  }
});

module.exports = mongoose.model('Posts', PostSchema);
