const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');

const Posts = require('./post.js');

const STATUS_USER_ERROR = 422;

const server = express();
// to enable parsing of json bodies for post requests

server.use(bodyParser.json());

server.get('/accepted-answer/:soID', (req, res) => {
  const questionId = req.params.soID + '';
  Posts.findOne({ 'soID': questionId })
    .then(question => {
      if(question) {
        Posts.findOne({ 'soID': question.acceptedAnswerID })
          .then(answer => {
            res.status(200).send({ question: question, answer: answer });
          })
      }
    })
    .catch(err => {
      console.error('error', err);
    })
});

module.exports = { server };
