const bodyParser = require('body-parser');
const express = require('express');

const Post = require('./post.js');


const STATUS_OK = 200;
const STATUS_NOT_FOUND = 404;
const STATUS_USER_ERROR = 422;
const STATUS_SERVER_ERROR = 500;

const server = express();
// to enable parsing of json bodies for post requests

server.use(bodyParser.json());

// TODO: write your route handlers here
server.get('/accepted-answer/:soID', (req, res) => {
  const {
    soID
   } = req.params;

  Post.findOne({ soID })
    .then(post => {
      Post.findOne({ soID: post.acceptedAnswerID })
        .then(answer => {
          if(answer) {
            res.status(200).json(answer);
          } else {
            res.status(404).json({ message: "The post with specified ID does not exisit." });
          }
        })
        .catch(error => {
          res.status(500).json({ error: "The information could not be retrieved." });
        });
    })
    .catch(error => {
      res.status(500).json({ error: "The information could not be retrieved." });
    });
});

module.exports = { server };
