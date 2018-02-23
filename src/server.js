const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');

const Post = require('./post.js');

const STATUS_USER_ERROR = 422;

const server = express();
// to enable parsing of json bodies for post requests

server.use(bodyParser.json());

// TODO: write your route handlers here

server.get('/accepted-answer/:soID', (req, res) => {
  const { soID } = req.params;

  Post.findOne({ soID })
    .then(post => {
      const id = post.acceptedAnswerID;
      Post.findOne({soID: id})
        .then(answerPost => {
          if(answerPost) {
            res.status(200).json(answerPost);
          } else {
            res.status(404).json(`Not found by this id`);
          }
        })
        .catch(error => {
          res.status(500).json({errorMessage: 'Can not access server for answer post.'});
        })
    })
    .catch(error => {
      res.status(500).json({errorMessage: 'Can not access server for question post.'});
    })
});

module.exports = { server };
