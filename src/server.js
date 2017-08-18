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

<<<<<<< HEAD
server.get('/accepted-answer/:soID', (req, res) => {
  const { soID } = req.params;
  Post.findOne({ soID }, (err, post) => {
    if (!post) {
      res.status(STATUS_USER_ERROR);
      res.json({ error: 'User Error in top-answer' });
      return;
    }
    Post.find({ soID: post.acceptedAnswerID }, (error, answer) => {
      if (!answer) {
        res.status(STATUS_USER_ERROR);
        res.json({ error: 'User Error in top-answer find' });
        return;
      }
      res.json(answer);
    });
  });
});

=======
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
>>>>>>> b0f14620fa48a2e9fa2f082dd935f799c7d93aab

module.exports = { server };
