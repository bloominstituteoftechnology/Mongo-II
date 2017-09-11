const bodyParser = require('body-parser');
const express = require('express');
const Post = require('./post');

const STATUS_USER_ERROR = 422;

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());


// TODO: write your route handlers here
// -------Test GET API---------
server.get('/posts', (req, res) => {
  Post.find({}, (err, post) => {
    if (err) throw err;
    else {
      res.json(post);
    }
  });
});

// ----Get Answer to Question------
server.get('/accepted-answer/:soID', (req, res) => {
  const { soID } = req.params;
  Post.find({ soID })
    .exec((err, post) => {
      if (err) throw err;
      else {
        Post.findOne({ soID: post.acceptedAnswerID })
          .exec((newErr, newPost) => {
            // if (err) throw err;
            res.json(newPost);
          });
      }
    });
});

// ----GET Top answer------
server.get('/top-answer/:soID', (req, res) => {
  const { soID } = req.params;
  Post.find({ soID })
    .exec((err, post) => {
      if (err) throw err;
      Post.findOne({ soID: { $ne: post.acceptedAnswerID }, parentID: post.soID })
      .sort({ score: 'desc' })
      .exec((newErr, newPost) => {
        if (newErr) throw err;
        res.json(newPost);
      });
    });
});

// ------JQuery Questions----------
server.get('/popular-jquery-questions', (req, res) => {
  Post.find({ tags: 'jquery' })
  .or([{ score: { $gt: 5000 } }, { 'user.reputation': { $gt: 200000 } }])
  .exec((err, post) => {
    if (err) throw err;
    else {
      res.json(post);
    }
  });
});

// -----NPM Answers---------
server.get('/npm-answers', (req, res) => {
  Post.find({ tags: 'npm' })
    .exec((err, post) => {
      if (err) throw err;
      else {
        const questionIDs = post.map(question => question.soID);
        Post.find({ parentID: { $in: questionIDs } })
          .exec((newErr, newPost) => {
            if (newErr) throw err;
            res.json(newPost);
          });
      }
    });
});

module.exports = { server };
