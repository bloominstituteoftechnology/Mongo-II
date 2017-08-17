const mongoose = require('mongoose');

// Clear out mongoose's model cache to allow --watch to work for tests:
// https://github.com/Automattic/mongoose/issues/1251
mongoose.models = {};
mongoose.modelSchemas = {};

mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/so-posts', { useMongoClient: true });

const PostSchema = new mongoose.Schema({
  // TODO: write your schema here
  soId: {
    type: Number,
  },
  parentId: {
    type: Number,
  },
  url: {
    type: String,
  },
  title: {
    type: String,
  },
  body: {
    type: String,
  },
  score: {
    type: Number,
  },
  tags: {
    type: Array,
  }
});

module.exports = mongoose.model('Post', PostSchema);
