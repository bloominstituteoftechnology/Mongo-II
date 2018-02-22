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
    index: true,
    min: 110000,
  },
  parentID: {
    type: Number,
    index: true,
    default: null,
  },
  url: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    index: true,
  },
  body: {
    type: String,
    
  }  
});

module.exports = mongoose.model('Posts', PostSchema);
