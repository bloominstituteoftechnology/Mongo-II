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

server.get('/popular-jquery-questions', (req, res) => {
  Post.find({ tags: 'jquery', parentID: null }).or([ { score: { $gt: 5000 } }, { 'user.reputation': { $gt: 200000 } } ])
    .then(questions => {
      if (questions) {
        res.status(STATUS_OK).json(questions);
      } else {
        res.status(STATUS_USER_ERROR).json({ error: "There is no questions with specified tag." });
      }
    })
    .catch(error => {
      res.status(STATUS_USER_ERROR).json({ error: "There was an error retrieving the questions." });
    });
});

module.exports = { server };
