const mongoose = require('mongoose');
require('mongoose-type-url');

// Clear out mongoose's model cache to allow --watch to work for tests:
// https://github.com/Automattic/mongoose/issues/1251
mongoose.models = {};
mongoose.modelSchemas = {};

mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/so-posts', { useMongoClient: true });

const PostSchema = new mongoose.Schema({
  soID: { type: Number, required: true },
  parentID: { type: Number, required: false },
  title: String,
  url: { type: mongoose.SchemaTypes.Url, required: true },
  body: { type: String, required: true },
  score: { type: Number, required: true },
  tags: [String],
  acceptedAnswerID: { type: Number, required: false },
  user: { type: {
    soUserID: Number,
    name: String,
    reputation: Number
  },
    required: false }
});

module.exports = mongoose.model('Posts', PostSchema);
