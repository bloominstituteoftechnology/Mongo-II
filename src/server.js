const bodyParser = require('body-parser');
const express = require('express');

const STATUS_USER_ERROR = 422;
const Post = require('./post.js');

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());

const sendUserError = (error, res) => {
  res.status(STATUS_USER_ERROR);
  res.json({ error });
};

// TODO: write your route handlers here
server.get('/accepted-answer/:soID', (req, res) => {
  const { soID } = req.params;
  Post.findOne({ soID }, (err, post) => {
    if (!post) {
      sendUserError({ error: 'User Error in accepted-answer' }, res);
      return;
    }
    Post.findOne({ soID: post.acceptedAnswerID }, (error, answer) => {
      if (!answer) {
        sendUserError({ error: 'User Error in accepted answer findOne' }, res);
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
      sendUserError({ error: `User Error in top-answer with ${soID}` }, res);
      return;
    }
    Post.find({ $and: [{ parentID: soID }, { soID: { $ne: post.acceptedAnswerID } }] }, (error, answers) => {
      if (!answers || !answers.length) {
        sendUserError({ error: 'User Error in top-answer find' }, res);
        return;
      }
      const topAnswer = answers.reduce((ta, e) => {
        return e.score > ta.score ? e : ta;
      }, answers[0]);
      res.json(topAnswer);
    });
  });
});

server.get('/popular-jquery-questions', (req, res) => {
  Post.find({ $and: [ {tags: { $in: ['jquery'] } }, { $or: [ { score: { $gt: 5000 } }, { 'user.reputation': { $gt: 200000 } } ]} ] }, (err, posts) => {
    if (err) {
      sendUserError({ error: 'User Error in popular-jquery-questions' });
      return;
    }
    res.json(posts);
  });
});

server.get('/npm-answers', (req, res) => {
  Post.find({ tags: { $in: ['npm'] }}, (err, posts) => {
    if (err) {
      sendUserError({ error: 'User Error in npm-answers' });
      return;
    }
    Post.find({ parentID: { $in: { posts } } }, (error, answers) => {
      if (error) {
        sendUserError({ error: 'User Error in npm-answers find' });
        return;
      }
      json(answers);
    });
  });
});

module.exports = { server };
