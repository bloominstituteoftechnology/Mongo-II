const mongoose = require('mongoose');

// Clear out mongoose's model cache to allow --watch to work for tests:
// https://github.com/Automattic/mongoose/issues/1251
mongoose.models = {};
mongoose.modelSchemas = {};

mongoose.Promise = Promise;
// explicitly calling :27017         vvvvvv √
mongoose.connect('mongodb://localhost:27017/so-posts', { useMongoClient: true });

const PostSchema = new mongoose.Schema({
  // TODO: write your schema here
  soID: {
    type: Number,
    required: true,
    // unique: true,
  },
  parentID: {
    type: Number,
    default: null,
  },
  url: {
    type: String,
    // default: `https://stackoverflow.com/q/${soID}`,
    // type: mongoose.Schema.Types.ObjectId,
    // refs: 'soID',
    // default: `https://stackoverflow.com/q/${soID}`,
    required: true,
  },
  title: {
    type: String,
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
    // type: Array,
    type: [String],
  },
  acceptedAnswerID: {
    type: Number,
    default: null,
  },
  user: {
    soUserID: Number,
    name: String,
    reputation: Number,
    // required: true,
    // required: {
    //   type: Boolean,
    //   default: true,
    // },
  },
  // createdAt: {
  //   type: Date,
  //   default: Date.now,
  // },
});

module.exports = mongoose.model('Posts', PostSchema);
