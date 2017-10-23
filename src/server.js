const bodyParser = require('body-parser');
const express = require('express');

const Post = require('./post.js');

const STATUS_USER_ERROR = 422;

const server = express();
// to enable parsing of json bodies for post requests

server.use(bodyParser.json());

// TODO: write your route handlers here

server.get('/accepted-answer/:soID', (req, res) => {
  const { soID } = req.params;
  const currentID = soID;
  Post.findOne({ soID: currentID }, (err, foundPost) => {
    if (err) {
      return res
        .status(STATUS_USER_ERROR)
        .json(err);
    }
    const currentPost = foundPost;
    if (currentPost.acceptedAnswerID === null) {
      return res
        .status(STATUS_USER_ERROR)
        .json({ error: 'No accepted answers for this ID' });
    }
    Post.findOne({ soID: currentPost.acceptedAnswerID }, (err2, foundNewPost) => {
      if (err2) {
        return res
          .status(STATUS_USER_ERROR)
          .json(err2);
      }
      res.json(foundNewPost);
    });
  });
});

server.get('/top-answer/:soID', (req, res) => {
  const { soID } = req.params;
  const currentID = soID;
  Post.findOne({ soID: currentID }, (err, question) => {
    if (err) {
      return res
        .status(STATUS_USER_ERROR)
        .json(err);
    }
    if (!question || question === undefined) {
      return res
        .status(STATUS_USER_ERROR)
        .json({ error: 'oops' });
    }
    const currentPost = question;
    let accepted = 1;
    if (typeof currentPost.acceptedAnswerID === 'number') accepted = currentPost.acceptedAnswerID;
    Post.find({ $and: [{ soID: { $ne: accepted } }, { parentID: currentID }] }).sort({ score: -1 }).findOne({}, (err2, foundPost) => {
      if (err2) {
        return res
          .status(STATUS_USER_ERROR)
          .json(err2);
      }
      if (!foundPost) {
        return res
        .status(STATUS_USER_ERROR)
        .json({ error: 'no top answer' });
      }
      res.json(foundPost);
    });
  });
});

server.get('/popular-jquery-questions', (req, res) => {
  Post.find({ $and: [{ tags: { $in: ['jquery'] } }, { $or: [{ score: { $gte: 5000 } }, { 'user.reputation': { $gte: 200000 } }] }] }, (err, foundPosts) => {
    if (err) {
      return res
        .status(STATUS_USER_ERROR)
        .json(err);
    }
    res.json(foundPosts);
  });
});

server.get('/npm-answers', (req, res) => {
  Post.find({ parentID: null, tags: { $in: ['npm'] } }, (err, foundPosts) => {
    if (err) {
      return res
        .status(STATUS_USER_ERROR)
        .json(err);
    }
    let idArr = [];
    idArr = foundPosts.map(post => post.soID);
    Post.find({ parentID: { $in: idArr } }, (err, answers) => {
      if (err) {
        return res
          .status(STATUS_USER_ERROR)
          .json(err);
      }
      return res.json(answers);
    });
  });
});

module.exports = { server };
