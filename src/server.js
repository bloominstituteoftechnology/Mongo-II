const bodyParser = require('body-parser');
const express = require('express');

const Post = require('./post.js');

const STATUS_USER_ERROR = 422;

const server = express();
// to enable parsing of json bodies for post requests

server.use(bodyParser.json());
// helper function to error handling
const myErrorHandler = (err, res) => {
  res.status(STATUS_USER_ERROR);
  if (typeof err === 'string') {
    res.json({ error: err });
  } else {
    res.json(err);
  }
};

// TODO: write your route handlers here
server.get('/posts', (req, res) => {
  Post.find({}, (err, post) => {
    if (err) {
      res.status(STATUS_USER_ERROR).json({ 'error: could not get your posts': err });
    } else {
      res.json(post);
    }
    return;
  });
});
server.get('/accepted-answer/:soID', (req, res, next) => {
  // find one document by given id;
  const { soID } = req.params;
  Post.findOne({ soID }, (err1, foundPost) => {
    if (err1 || foundPost === null) {
      myErrorHandler('There is no post found by soID', res);
      return;
    }
    Post.findOne({ soID: foundPost.acceptedAnswerID }, (err2, acceptedAnswer) => {
      if (err2 || acceptedAnswer === null) {
        myErrorHandler(err2, res);
        return;
      }
      res.json(acceptedAnswer);
    });
  });
});
server.get('/top-answer/:soID', (req, res) => {
  const { soID } = req.params;
  Post.findOne({ soID }, (err1, foundPost) => {
    if (!foundPost) {
      myErrorHandler(err1, res);
      return;
    }
    // post.soID which will map to the parent Id of our next query
    // post.acceptedAnswerId which needs to be not equal to stack overflow id
    // sort by descending and grab the top or first answer while not being the accepted answer
    // grab that answer
    Post.findOne({ soID: { $ne: foundPost.acceptedAnswerID }, parentID: soID }).sort(
      { score: 'desc' }
    )
    .exec((err2, sortedAnswer) => {
      if (!sortedAnswer) {
        myErrorHandler(err2, res);
        return;
      }
      res.json(sortedAnswer);
    });
  });
});

server.get('/popular-jquery-questions', (req, res) => {
  // filter out results where parentID is null
  // tags need include jquery
  // score needs to be greater than 5000 'gt'
  // user.reputation needs to be $gt 200,000
  Post.find({
    parentID: null,
    tags: 'jquery',
    acceptedAnswerID: { $ne: null },
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
  Post.find({
    tags: 'npm',
  },
  (err, questions) => {
    if (err || questions.length === 0) {
      myErrorHandler(err, res);
      return;
    }
    Post.find({
      parentID: { $in: questions.map(q => q.soID) },
    }).exec((err1, answers) => {
      if (err1 || answers.length === 0) {
        myErrorHandler(err1, res);
        return;
      }
      res.json(answers);
    });
    // loop over the array of questions
    // match where questions soID equals parentID
  });
});
module.exports = { server };
