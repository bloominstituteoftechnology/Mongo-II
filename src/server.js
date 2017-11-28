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
  Post.findOne({ soID })
    .select('acceptedAnswerID')
    .exec((err, post) => {
      if (err) res.status(STATUS_USER_ERROR);
      else return post;
    })
    .then((answerID) => {
      Post.findOne({ soID: answerID.acceptedAnswerID }, (err, post) => {
        if (err) res.status(STATUS_USER_ERROR);
        else return res.json(post);
      });
    });
});
server.get('/top-answer/:soID', (req, res) => {
  const { soID } = req.params;
  Post.find({ parentID: soID })
    .sort({ score: -1})
    .exec((err, post) => {
      if (err) res.status(STATUS_USER_ERROR);
      else return post;
    })
    .then((scores) => {
      res.json(scores[0]);
    });
});
module.exports = { server };
