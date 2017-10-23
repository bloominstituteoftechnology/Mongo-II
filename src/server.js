const bodyParser = require('body-parser');
const express = require('express');

const Post = require('./post.js');

const STATUS_USER_ERROR = 422;

const server = express();
// to enable parsing of json bodies for post requests

server.use(bodyParser.json());

server.get('/accepted-answer/:soID', (req, res) => {
  const { soID } = req.params;
  Post.findOne({ soID }, 'acceptedAnswerID')
  .then((answerID) => {
    if (!answerID.acceptedAnswerID) {
      res.status(STATUS_USER_ERROR).json({ error: 'post has no accepted answer' });
      return;
    }
    Post.findOne({ soID: answerID.acceptedAnswerID })
    .then((answer) => {
      res.json(answer);
    });
  })
  .catch((error) => {
    res.status(STATUS_USER_ERROR).json({ error });
  });
});

server.get('/top-answer/:soID', (req, res) => {
  const { soID } = req.params;
  Post.findOne({ soID })
  .then((post) => {
    Post.find({
      soID: { $ne: post.acceptedAnswerID },
      parentID: post.soID,
    })
    .sort({ score: -1 })
    .then((posts) => {
      if (posts.length === 0) {
        res.status(STATUS_USER_ERROR).json({ error: 'post has no top answer' });
        return;
      }
      res.json(posts[0]);
    });
  })
  .catch((error) => {
    res.status(STATUS_USER_ERROR).json({ error });
  });
});

server.get('/popular-jquery-questions', (req, res) => {
  Post.find({
    tags: 'jquery',
    $or: [{ score: { $gt: 5000 } }, { 'user.reputation': { $gt: 200000 } }]
  })
  .then((posts) => {
    res.json(posts);
  })
  .catch((error) => {
    res.status(STATUS_USER_ERROR).json({ error });
  });
});

server.get('/npm-answers', (req, res) => {
  Post.find({ tags: 'npm' })
  .then((npmQuestions) => {
    const ids = npmQuestions.map((post) => {
      return post.soID;
    });
    Post.find({ parentID: ids })
    .then((npmAnswers) => {
      res.json(npmAnswers);
    });
  })
  .catch((error) => {
    res.status(STATUS_USER_ERROR).json({ error });
  });
});

module.exports = { server };
