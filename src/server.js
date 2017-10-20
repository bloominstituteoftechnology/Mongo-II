const bodyParser = require('body-parser');
const express = require('express');
const Posts = require('./post');

const Post = require('./post.js');

const STATUS_USER_ERROR = 422;

const server = express();
// to enable parsing of json bodies for post requests

server.use(bodyParser.json());

// TODO: write your route handlers here
const serverErr = (req, res) => {
  return res.status(500).json({ error: 'Internal Error' });
};

const userErr = (req, res, message) => {
  return res.status(422).json({ error: message });
};

server.get('/accepted-answer/:soID', (req, res) => {
  const { soID } = req.params;
  Posts.findOne({ soID }, (err, question) => {
    if (err || !question) return userErr(req, res, 'Does not exist');
    Posts.findOne({ soID: question.acceptedAnswerID }, (err2, answer) => {
      if (err2) return serverErr(req, res);
      if (!answer) return userErr(req, res, 'Not found');
      res.json(answer);
    });
  });
});

server.get('/top-answer/:soID', (req, res) => {
  const { soID } = req.params;
  Posts.findOne({ soID }, (err, question) => {
    if (err || !question) return userErr(req, res, 'Does not exist');
    const foundPost = Posts.findOne({
      soID: { $ne: question.acceptedAnswerID },
      parentID: question.soID
    });
    foundPost.sort({ score: 'desc' }).exec((errA, answer) => {
      if (errA || !answer) return userErr(req, res, 'Does not exist');
      res.json(answer);
    });
  });
});

server.get('/popular-jquery-questions', (req, res) => {
  Posts.find({
    tags: { $in: ['jquery'] },
    $or: [
      { score: { $gte: 5000 } },
      { 'user.reputation': { $gte: 200000 } }
    ]
  }, (errA, results) => {
    if (errA || !results) return userErr(req, res, 'No such post');
    res.json(results);
  });
});


server.get('/npm-answers', (req, res) => {
  Posts.find({ tags: { $in: ['npm'] } }, (errA, results) => {
    if (errA || !results) return userErr(req, res, 'No such post');
    const questionID = results.map(result => result.soID);
    Posts.find({ parentID: { $in: questionID } }, (errB, answers) => {
      if (errB) return userErr(req, res, errB);
      res.json(answers);
    });
  });
});

module.exports = { server };
