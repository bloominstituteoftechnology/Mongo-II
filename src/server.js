const bodyParser = require('body-parser');
const express = require('express');

const Post = require('./post.js');

const STATUS_USER_ERROR = 422;

const server = express();
// to enable parsing of json bodies for post requests

server.use(bodyParser.json());


server.get('/accepted-answer/:soID', (req, res) => {
  const { soID } = req.params;
  Post.findOne({ soID })
    .then(post => {
      if (post === null) {
        res.status(STATUS_USER_ERROR).json({ message: "No such post exists."})
      } else {
        Post.findOne({ soID: post.acceptedAnswerID })
          .then(answer => {
            if (!answer) {
              res.status(STATUS_USER_ERROR).json({ message: "No such answer exists"});
            } else {
              res.json(answer);
            }
          });
      };
    });
});

server.get('/top-answer/:soID', (req, res) => {
  const { soID } = req.params;
  Post.findOne({ soID })
    .then(post => {
      if (!post) {
        res.status(STATUS_USER_ERROR).json({ message: "No such post exists." });
      } else {
        Post.findOne({ soID: post.acceptedAnswerID })
          .sort({ score: 'desc' })
          .then(answer => {
            if (!answer) {
              res.status(STATUS_USER_ERROR).json({ message: "No such answer exists." });
            } else {
              res.json(answer);
            }
          });
      };
    });
});


module.exports = { server };
