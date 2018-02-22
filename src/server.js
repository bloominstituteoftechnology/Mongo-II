const bodyParser = require('body-parser');
const express = require('express');

const Post = require('./post.js');

const STATUS_USER_ERROR = 422;

const server = express();
// to enable parsing of json bodies for post requests

server.use(bodyParser.json());

// TODO: write your route handlers here

server.get('/accepted-answer/:soID', (req, res) => {
  Post.find({ soID: +req.params.soID })
    .populate('acceptedAnswerId').then((post) => {
      Post.find({ soId: post.acceptedAnswerId })
        .then((answer) => {
          res.json(answer);
        });
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

module.exports = { server };
