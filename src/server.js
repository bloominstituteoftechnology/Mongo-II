const bodyParser = require('body-parser');
const express = require('express');
const Post = require('./post');

const STATUS_USER_ERROR = 422;

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());

// TODO: write your route handlers here
server.get('/accepted-answer/:soID', (req, res) => {
  Post.findOne({ soID: req.params.soID })
  .exec((err, post) => {
    if (err) {
      res.status(STATUS_USER_ERROR);
      res.json({ 'No accepted post': err });
      return;
    }
    Post.findOne({ soID: post.acceptedAnswerID })
    .exec((error, p) => {
      if (error || post.acceptedAnswerID === null) {
        res.status(STATUS_USER_ERROR);
        res.json('No accepted answer');
        return;
      }
      res.json(p);
    });
  });
});

server.get('/top-answer/:soID', (req, res) => {
  Post.findOne({ soID: req.params.soID })
  .exec((err, post) => {
    if (err) {
      res.status(STATUS_USER_ERROR);
      res.json({ 'No accepted post': err });
      return;
    }
    Post.findOne({
      soID: { $ne: post.acceptedAnswerID },
      parentID: post.soID,
    })
    .sort({ score: -1 })
    .exec((error, p) => {
      if (err || post.acceptedAnswerID === null) {
        res.status(STATUS_USER_ERROR);
        res.json('No accepted answer');
        return;
      }
      res.json(p);
    });
  });
});

server.get('/popular-jquery-questions', (req, res) => {
  Post.find({
    $and: [{ tags: 'jquery' }, {
      $or: [{ score: { $gt: 5000 } }, { 'user.reputation': { $gt: 200000 } }] }
    ] })
    .exec((err, post) => {
      if (err) {
        res.status(STATUS_USER_ERROR);
        res.json({ 'No accepted post': err });
        return;
      }
      res.json(post);
    });
});

server.get('/npm-answers', (req, res) => {
  Post.find({
    parentID: null,
    tags: 'npm'
  }).exec((err, posts) => {
    if (err) {
      res.status(STATUS_USER_ERROR);
      res.json({ 'No accepted post': err });
    }
    Post.find({
      parentID: { $in: posts }
    });
  });
});

module.exports = { server };
