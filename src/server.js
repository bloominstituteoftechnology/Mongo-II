const bodyParser = require('body-parser');
const express = require('express');

const Post = require('./post.js');

const STATUS_SERVER_ERROR = 500;
const STATUS_USER_ERROR = 422;

const server = express();
// to enable parsing of json bodies for post requests

server.use(bodyParser.json());

// TODO: write your route handlers here
server.get('/accepted-answer/:soID', (req, res) => {
  const { soID } = req.params;
  Post.findOne({ soID }, (err1, foundPost) => {
    if (err1 || foundPost === null) {
      res.status(STATUS_USER_ERROR).json(err1);
      return;
    }
    Post.findOne({ soID: foundPost.acceptedAnswerID }, (err2, acceptedAnswer) => {
      if (err2 || acceptedAnswer === null) {
        res.status(STATUS_USER_ERROR).json(err2);
        return;
      }
      res.json(acceptedAnswer);
    });
  });
});

server.get('/top-answer/:soID', (req, res) => {
  const { soID } = req.params;
  Post.findOne({ soID }, (err1, foundPost) => {
    if (err1 || foundPost === null) {
      res.status(STATUS_USER_ERROR).json(err1);
      return;
    }
    const aid = foundPost.acceptedAnswerID;
    Post.find()
      .where({ parentID: soID })
      .where('soID')
      .ne(aid)
      .sort({ score: 'desc' })
      .exec()
      .then((err2, posts) => {
        if (err2 || posts.length === 0 || !posts) {
          res.status(STATUS_USER_ERROR).json(err2);
          return;
        }
        res.json(posts[0]);
      });
  });
});

server.get('/popular-jquery-questions', (req, res) => {
  Post.find()
    .where({ tags: { $in: ['jquery'] } })
    .where({ $or: [{ score: { $ge: 5000 } }, { 'user.reputation': { $ge: 200000 } }] })
    .$where({ parentID: null })
    .exec()
    .then((err, posts) => {
      if (err || posts.length === 0 || !posts) {
        res.status(STATUS_USER_ERROR).json(err);
        return;
      }
      res.json(posts);
    });
});

module.exports = { server };
