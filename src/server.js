const bodyParser = require('body-parser');
const express = require('express');

const Post = require('./post.js');

const STATUS_USER_ERROR = 422;

const server = express();
// to enable parsing of json bodies for post requests

server.use(bodyParser.json());

// TODO: write your route handlers here
server.get('/accepted-answer/:soID', (req, res) => {
  const { soID } = req.params; // destructered
  Post.findOne({ soID })
    .then((question) => {
      if (!question) throw new Error('No question found');
      if (!question.acceptedAnswerID) throw new Error('No answer found');
      return Post.findOne({ soID: question.acceptedAnswerID });
   })
    .catch;

})

module.exports = { server };
