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
    unique: true,
    required: true
  },
  parentID: {
    type: Number,
    default: null
  },
  url: {
    type: String,
    required: true
  },
  title: {
    type: String
  },
  body: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  tags: {
    type: Array
  },
  acceptedAnswerID: {
    type: Number
  },
  user: {
    soUserID: {
      type: Number
    },
    name: {
      type: String
    },
    reputation: {
      type: Number
    }
  }


});

module.exports = mongoose.model('Posts', PostSchema);
