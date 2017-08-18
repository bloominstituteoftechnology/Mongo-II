const bodyParser = require('body-parser');
const express = require('express');
const Post = require('./post');

const STATUS_USER_ERROR = 422;

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());

// TODO: write your route handlers here

server.get('/accepted-answer/:soID', (req, res) => {
  const { soID } = req.params;
  let acceptedAnswerID = 0;
  Post.find({ soID }, (error, data) => {
    if (error) {
      res.status(500);
      res.json({ error });
    } else {
    }
  });
  console.log(acceptedAnswerID);
  Post.find({ soID: acceptedAnswerID }, (error, data) => {
    if (error) {
      res.status(500);
      res.json({ error });
    }
    res.json({ data });
  });
});

server.get('/top-answer/:soID', (req, res) => {
  const { soID } = req.params;
});

server.get('/popular-jquery-questions', (req, res) => {

});

server.get('/npm-answers', (req, res) => {

});

module.exports = { server };
