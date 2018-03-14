const bodyParser = require('body-parser');
const express = require('express');

const Post = require('./post.js');

const STATUS_USER_ERROR = 422;

const server = express();
// to enable parsing of json bodies for post requests

server.use(bodyParser.json());

// TODO: write your route handlers here
server.get('/accepted-answer/:soID', (req, res) => {
  let answerID = null;
  const { soID } = req.params;
  Post.find({ "soID": soID })
    .then(post => {
      answerID = post.acceptedAnswerID
      Post.find({ "answerID": answerID })
        .then(post => {
          res.status(200).json({AcceptedAnswer: post})
        })
        .catch(err => {
          res.status(500).json(err);
        })
    })
    .catch(err => {
      res.status(400).json(err);
    })
})

server.get('/', (req, res) => {
  Post.find()
    .then(posts => {
      res.status(200).json(posts)
    })
    .catch(err => {
      res.status(500).json({ Error: err });
    })
})

module.exports = { server };
