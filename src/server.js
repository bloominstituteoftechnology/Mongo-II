const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const async = require('async');

const Post = require('./post.js');

const STATUS_USER_ERROR = 422;

const server = express();
// to enable parsing of json bodies for post requests
mongoose.Promise = global.Promise;
server.use(bodyParser.json());

// TODO: write your route handlers here
server.get('/accepted-answer/:soID', (req, res) => {
  const { soID } = req.params;
  Post.where('soID', soID).exec((err, posts) => {
    if (err || posts[0].acceptedAnswerID === null) {
      return res.status(STATUS_USER_ERROR).json(err);
    }
    Post.where('soID', posts[0].acceptedAnswerID).exec((err1, post) => {
      if (err1) res.status(STATUS_USER_ERROR).json(err);
      res.json(post[0]);
    });
  });
});


server.get('/top-answer/:soID', (req, res) => {
  const { soID } = req.params;
  Post.find({ soID }, (err, posts) => {
    if (err || !posts[0]) {
      return res.status(STATUS_USER_ERROR).json(err);
    }
    Post.where('soID').ne(posts[0].acceptedAnswerID).where('parentID', posts[0].soID).sort('-score')
      .exec((err1, post) => {
        if (err || post.length === 0) return res.status(STATUS_USER_ERROR).json(err);
        res.json(post[0]);
      });
  });
});

server.get('/popular-jquery-questions', (req, res) => {
  Post.find({ parentID: null, tags: { $elemMatch: { $eq: 'jquery' } }, $or: [{ score: { $gt: 5000 } }, { 'user.reputation': { $gt: 200000 } }] }, (err, posts) => {
    if (err) res.status(STATUS_USER_ERROR).json(err);
    res.json(posts);
  });
});

server.get('/npm-answers', (req, res) => {
  Post.find({ tags: 'npm' }, async (err, posts) => {
    if (err) res.status(STATUS_USER_ERROR).json(err);
    const promises = posts.map(post => Post.find({ parentID: post.soID }).exec());
    const values = await Promise.all(promises);
    res.json([...values[0], ...values[1]]);
  });
});
module.exports = { server };
