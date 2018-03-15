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
            res.status(STATUS_OK).json(answer);
          } else {
            res.status(STATUS_USER_ERROR).json({ message: "There is no post with accepted answer." });
          }
        })
        .catch(error => {
          res.status(STATUS_USER_ERROR).json({ error: "The post with specified ID does not exisit." });
        });
    })
    .catch(error => {
      res.status(STATUS_USER_ERROR).json({ error: "The post with specified ID does not exisit." });
    });
});

server.get('/top-answer/:soID', (req, res) => {
  const {
    soID
  } = req.params;

  Post.findOne({ soID })
    .then(question => {
      if (question) {
        Post.find({ parentID: soID }).sort('-score')       
          .then(answers => {
            if (answers[0].soID === question.acceptedAnswerID) {
              res.status(STATUS_OK).json(answers[1]);
            } else {
              rest.status(STATUS_OK).json(answers[0]);
            }
          })
          .catch(error => {
            res.status(STATUS_USER_ERROR).json({ error: "There is no post with top answer." });
          });
      } else {
        res.status(STATUS_USER_ERROR).json({ error: "The post with specified ID does not exisit." });
      }
    })
    .catch(error => {
      res.status(STATUS_USER_ERROR).json({ error: "The post with specified ID does not exisit." });
    });
});

module.exports = { server };
