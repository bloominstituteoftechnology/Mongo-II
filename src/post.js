const mongoose = require('mongoose');


const Schema = mongoose.Schema;

// Clear out mongoose's model cache to allow --watch to work for tests:
// https://github.com/Automattic/mongoose/issues/1251
mongoose.models = {};
mongoose.modelSchemas = {};

const PostSchema = new mongoose.Schema({
  soID: {
    type: Number
  },

  parentID: {
    type: Number
  },

  url: {
    type: String
  },

  title: {
    type: String
  },

  body: {
    type: String
  },

  score: {
    type: Number
  },

  tags: {
    type: [String]
  },

  acceptedAnswerID: {
    type: Number
  },

  // Separated User Schema
  // user: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'User'
  // }

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


module.exports = mongoose.model('Post', PostSchema);

