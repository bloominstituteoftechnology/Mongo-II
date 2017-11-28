const bodyParser = require('body-parser');
const express = require('express');

const Post = require('./post.js');

const STATUS_USER_ERROR = 422;

const server = express();
// to enable parsing of json bodies for post requests

server.use(bodyParser.json());

// write a helper function to offload the work for errorhandling
// err, objectQueried, res

const myErrorHandler = (err, res) => {
  res.status(STATUS_USER_ERROR);
  if (typeof err === 'string') {
    res.json({ error: err });
  } else {
    res.json(err);
  }
};

server.get('/accepted-answer/:soID', (req, res) => {
  const { soID } = req.params;
  Post.findOne({ soID }, (err1, foundPost) => {
    if (!foundPost) {
      myErrorHandler('There is no post found by that soID', res);
      return;
    }
    Post.findOne(
      { soID: foundPost.acceptedAnswerID },
      (err2, acceptedAnswer) => {
        if (err2 || acceptedAnswer === null) {
          myErrorHandler(err2, res);
          return;
        }
        res.json(acceptedAnswer);
      },
    );
  });
  // findOne document by the given id;
});

server.get('/top-answer/:soID', (req, res) => {
  const { soID } = req.params;
  Post.findOne({ soID }, (err, post) => {
    if (!post) {
      myErrorHandler('There is no post found by that soID', res);
      return;
    }
    Post.findOne({ soID: { $ne: post.acceptedAnswerID }, parentID: soID })
      .sort({ score: 'desc' })
      .exec((err2, sortedAnswer) => {
        if (!sortedAnswer) {
          myErrorHandler('Nuffin der', res);
          return;
        }
        res.json(sortedAnswer);
      });
  });
});

server.get('/popular-jquery-questions', (req, res) => {
  Post.find({
    parentID: null,
    tags: 'jquery',
    $or: [{ score: { $gt: 5000 } }, { 'user.reputation': { $gt: 200000 } }],
  }).exec((err, posts) => {
    if (err || posts.length === 0) {
      myErrorHandler(err, res);
      return;
    }
    res.json(posts);
  });
});

server.get('/npm-answers', (req, res) => {
  Post.find(
    {
      tags: 'npm',
    },
    (err, questions) => {
      if (err || questions.length === 0) {
        myErrorHandler(err, res);
        return;
      }
      Post.find({
        parentID: { $in: questions.map(question => question.soID) },
      }).exec((err1, answers) => {
        if (err1 || answers.length === 0) {
          myErrorHandler(err1, res);
          return;
        }
        res.json(answers);
      });
      // loop over array of questions
      // match where questions soID === parentID
    },
  );
});
module.exports = { server };
