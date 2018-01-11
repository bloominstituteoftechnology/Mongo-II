const bodyParser = require('body-parser');
const express = require('express');

const Post = require('./post.js');

const STATUS_USER_ERROR = 422;

const server = express();
// to enable parsing of json bodies for post requests

server.use(bodyParser.json());

// TODO: write your route handlers here
server.get('/accepted-answer/:soID', (req, res) => {
  const id = req.params.soID;
  Post.find({ soID: id }, { acceptedAnswerID: 1, _id: 0 })
    .then((post) => {
      return Post.find({ soID: post[0].acceptedAnswerID.toString() });
    })
    .then((post) => {
      if (post === 'undefined') {
        res.status(404).json({ error: 'ID Not Found' });
      } else {
        res.status(200).json(post);
      }
    })
    .catch((err) => {
      res.status(500).json({ error: 'Error getting data' });
    });
});

module.exports = { server };
