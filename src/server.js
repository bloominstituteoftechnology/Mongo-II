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

server.get('/popular-jquery-questions', (req, res) => {
  Post.find({
    tags: "jquery",
    $or: [{ "user.reputation": { $gt: 200000 } }, { score: { $gt: 5000 }}]
  })
  .then(post => {
    if (!post) {
      res.status(STATUS_USER_ERROR).json({ message: "No such post found." });
    } else {
      res.json(post);
    }
  });
});

server.get('/npm-answers', (req, res) => {
  Post.find({
    tags: "npm"
  })
  .then(posts => {
    if (!posts) {
      res.status(STATUS_USER_ERROR).json({ message: "No posts found!" });
    } else {
      res.json(posts);
    }
  });
});

module.exports = { server };
