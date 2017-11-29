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
    required: true
  },
  parentID: Number,
  url: {
    type: String,
    required: true
  },
  title: String,
  body: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true,
  },
  tags: [String],
  acceptedAnswerID: Number,
  user: {
    soUserID: Number,
    name: String,
    reputation: Number
  }
});

PostSchema.statics.findQuestion = function (id) {
  return new Promise((resolve, reject) => {
    this.findOne({ soID: id }, (error, question) => {
      return error ? resolve(null) : resolve(question);
    });
  });
};

PostSchema.statics.findQuestions = function (options) {
  return new Promise((resolve, reject) => {
    this.find(options, (err, questions) => {
      return err ? reject(err) : resolve(questions);
    });
  });
};

PostSchema.statics.findAnswers = function (questionID) {
  return new Promise((resolve, reject) => {
    this.find({ parentID: questionID }, (error, answers) => { return error ? resolve(null) : resolve(answers); });
  });
};

PostSchema.statics.getTopAnswer = function (id, acceptedAnswerID) {
  return new Promise((resolve, reject) => {
    this.findOne({ soID: { $ne: acceptedAnswerID }, parentID: id })
    .sort({ score: 'desc' })
    .exec((error, answer) => {
      return error ? reject(error) : resolve(answer);
    });
  });
};

module.exports = mongoose.model('Posts', PostSchema);
