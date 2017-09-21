const bodyParser = require('body-parser');
const express = require('express');

const mongoose = require('mongoose');
const Posts = require('./post');

const STATUS_USER_ERROR = 422;

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());

const errHandler = (err, res) => {
  res.status(STATUS_USER_ERROR);
  res.json({ error: err });
  return;
};

server.get('/accepted-answer/:soID', (req, res) => {
  const { soID } = req.params;
  Posts.findOne({ soID }, 'acceptedAnswerID', (errQ, question) => {
    if (errQ || !question.acceptedAnswerID) return errHandler(errQ = 'No Accepted Answer', res);
    Posts.findOne({ soID: question.acceptedAnswerID }, (errA, answer) => {
      if (errA) return errHandler(errA, res);
      res.json(answer);
    });
  });
});

server.get('/top-answer/:soID', (req, res) => {
  const { soID } = req.params;
  Posts.findOne({ soID }, (errP, parent) => {
    if (errP) return errHandler(errP, res);
    Posts.find({ parentID: parent.soID })
      .where({ soID: { $ne: parent.acceptedAnswerID } })
      .sort({ score: -1 })
      .exec((errA, answers) => {
        if (errA || answers.length === 0) return errHandler(errA = 'No Top Answer', res);
        res.json(answers[0]);
      });
  });
});

server.get('/popular-jquery-questions', (req, res) => {
  Posts.find({ parentID: null })
    .where({
      $and: [
        { tags: { $in: ['jquery'] } },
        { $or: [
          { score: { $gt: 5000 } },
          { 'user.reputation': { $gt: 200000 } }
        ]
        }
      ]
    })
    .exec((err, questions) => {
      if (err) return errHandler(err, res);
      res.json(questions);
    });
});

server.get('/npm-answers', (req, res) => {
  Posts.find({ tags: { $in: ['npm'] } }, (errQ, questions) => {
    if (errQ) return errHandler(errQ, res);
    const ids = questions.map(question => question.soID);
    Posts.find({ parentID: { $in: ids } }, (errA, answers) => {
      if (errA) return errHandler(errA, res);
      res.json(answers);
    });
  });
});

module.exports = { server };
