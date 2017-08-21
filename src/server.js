const bodyParser = require('body-parser');
const express = require('express');

const STATUS_USER_ERROR = 422;

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());

// TODO: write your route handlers here
const Post = require('./post');

// helper
const sendUserError = (err, res) => {
  res.status(STATUS_USER_ERROR);
  if (typeof err === 'string') {
    res.json({ error: err });
  } else {
    res.json(err);
  }
};

server.get('/accepted-answer/:soID', (req, res) => {
  const { soID } = req.params;
  Post.findOne({ soID })
    .exec((err, post) => {
      if (!post) {
        sendUserError(err, res);
        return;
      }
      Post.findOne({ soID: post.acceptedAnswerID })
        .exec((error, answer) => {
          if (!answer) {
            sendUserError(error, res);
            return;
          }
          res.json(answer);
        });
    });
});

server.get('/top-answer/:soID', (req, res) => {
  const { soID } = req.params;
  Post.findOne({ soID })
    .exec((err, post) => {
      if (!post) {
        sendUserError(err, res);
      } else {
        const soIDv = soID;
        const acceptedID = post.acceptedAnswerID;
        Post.find({ parentID: { $eq: soID } })
        .sort({ score: -1 })
        .exec((errs, answers) => {
          if (!answers) {
            sendUserError(errs, res);
            return;
          }
          for (let i = 0; i < answers.length; i++) {
            if (answers[i].soID !== acceptedID) {
              res.json(answers[i]);
            }
          }
          sendUserError(err, res);
        });
      }
    });
});


module.exports = { server };
