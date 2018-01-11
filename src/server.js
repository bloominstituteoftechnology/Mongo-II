const bodyParser = require('body-parser');
const express = require('express');

const Post = require('./post.js');

const STATUS_USER_ERROR = 422;

const server = express();

// to enable parsing of json bodies for post requests
server.use(bodyParser.json());

// TODO: write your route handlers here
server.get('/accepted-answer/:soID', (req, res) => {
  const { soID } = req.params;
  Post.findOne({ soID })
    .then((question) => {
      if (!question) throw new Error('No question found');
      if (!question.acceptedAnswerID) throw new Error('No answer found');
      return Post.findOne({ soID: question.acceptedAnswerID });
    })
    .then((answer) => {
      res.status(200).json(answer);
    })
    .catch((error) => {
      res.status(STATUS_USER_ERROR).json({ error: error.message });
    });
});

server.get('/top-answer/:soID', (req, res) => {
  const { soID } = req.params;
  Post.findOne({ soID })
    .then((question) => {
      if (!question) throw new Error('No question found');
      return Post.findOne({ soID: { $ne: question.acceptedAnswerID }, parentID: soID })
        .sort({ score: 'desc' });
    })
    .then((answer) => {
      if (!answer) throw new Error('No answer found');
      res.status(200).json(answer);
    })
    .catch((error) => {
      res.status(STATUS_USER_ERROR).json({ error: error.message });
    });
});

server.get('/popular-jquery-questions', (req, res) => {
  Post.find({ tags: 'jquery' }).or([{ score: { $gt: 5000 } }, { 'user.reputation': { $gt: 200000 } }])
    .then((questions) => {
      if (questions.length === 0) throw new Error('No questions found');
      res.status(200).json(questions);
    })
    .catch((error) => {
      res.status(STATUS_USER_ERROR).json({ error: error.message });
    });
});

server.get('/npm-answers', (req, res) => {
  Post.find({ tags: 'npm' })
    .then((questions) => {
      if (questions.length === 0) throw new Error('No questions found');
      const soIDs = [];
      questions.forEach(question => soIDs.push(question.soID));
      return Post.find({ parentID: { $in: soIDs } });
    })
    .then((answers) => {
      if (answers.length === 0) throw new Error('No answers found');
      res.status(200).json(answers);
    })
    .catch((error) => {
      res.status(STATUS_USER_ERROR).json({ error: error.message });
    });
});

module.exports = { server };
