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
  Post.findOne({ soID }, (err1, foundPost) => {
    if (err1 || !foundPost === null) {
      res.status(STATUS_USER_ERROR).json(err1);
      return;
    }
    Post.findOne({ soID: foundPost.acceptedAnswerID }, (err2, acceptedAnswer) => {
      if (err2 || acceptedAnswer === null) {
        res.status(STATUS_USER_ERROR).json(err2);
        return;
      }
      res.json(acceptedAnswer);
    },
  );
  });
});

server.get('/top-answer/:soID', (req, res) => {
  const { soID } = req.params;
  let highScore = 0;
  Post.findOne({ soID }, (err1, foundPost) => {
    if (err1 || !foundPost === null) {
      res.status(STATUS_USER_ERROR).json(err1);
      return;
    }
    Post.find({ soID: foundPost.acceptedAnswerID }, (err2, acceptedAnswer) => {
      if (err2 || acceptedAnswer === null) {
        res.status(STATUS_USER_ERROR).json(err2);
        return;
      }
      res.json(acceptedAnswer);
    },
  );
  });
});

module.exports = { server };
