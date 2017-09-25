const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Clear out mongoose's model cache to allow --watch to work for tests:
// https://github.com/Automattic/mongoose/issues/1251
mongoose.models = {};
mongoose.modelSchemas = {};

const UserSchema = new mongoose.Schema({
  soUserID: {
    type: Number,
    required: true,
    unique: true
  },

  name: {
    type: String,
  },

  reputation: {
    type: Number
  }
});

module.exports = mongoose.model('Users', UserSchema);

