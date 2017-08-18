const bodyParser = require('body-parser');
const express = require('express');

const STATUS_USER_ERROR = 422;
const Post = require('./post.js');

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());

// TODO: write your route handlers here
server.get('/accepted-answer/:soID', (req, res) => {
  const { soID } = req.params;
  Post.findOne({ soID }, (err, post) => {
    if (!post) {
      res.status(STATUS_USER_ERROR);
      res.json({ error: 'User Error in accepted-answer' });
      return;
    }
    Post.findOne({ soID: post.acceptedAnswerID }, (error, answer) => {
      if (!answer) {
        res.status(STATUS_USER_ERROR);
        res.json({ error: 'User Error in accepted-answer findOne' });
        return;
      }
      res.json(answer);
    });
  });
});

server.get('/top-answer/:soID', (req, res) => {
  const { soID } = req.params;
  Post.findOne({ soID }, (err, post) => {
    if (!post) {
      res.status(STATUS_USER_ERROR);
      res.json({ error: `User Error in top-answer with ${soID}` });
      return;
    }
    Post.find({ $and: [{ parentID: soID }, { soID: { $ne: post.acceptedAnswerID } }] }, (error, answers) => {
      if (!answers || !answers.length) {
        res.status(STATUS_USER_ERROR);
        res.json({ error: 'User Error in top-answer find' });
        return;
      }
      const topAnswer = answers.reduce((ta, e) => {
        return e.score > ta.score ? e : ta;
      }, answers[0]);
      res.json(topAnswer);
    });
  });
});

module.exports = { server };
