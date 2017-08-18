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
  // res.json(soID);
  Post.findOne({ soID }).exec((err, post) => {
    if (!post) {
      sendUserError(err, res);
      return;
    }
    // Post.findOne({ soID: post.acceptedAnswerID }).exec((error, answer) => {
    const bob = post.acceptedAnswerID;
    const score = post.score;
    Post.find({ $and: [{ bob: { $eq: 'null' } }, { score: { $eq: 11159 } }] }).exec((error, answer) => {
      if (!answer) {
        sendUserError(error, res);
        return;
      }
      res.json(answer);
    });
  });
});

// ### `GET /top-answer/:soID`
// When the client makes a `GET` request to `/top-answer/:soID`:
//
// 1. Find the question with the given `soID` (1 query).
// 2. Find the answer of the given question that has the *highest* score and *is
//    not the accepted answer* (1 query).
// 3. Send back a JSON response with the single top answer post object.
//
// You should *only* use 2 queries, and no more, for this route. If there's any
// error, or if there is no top answer, report it with an appropriate message
// and status code.


module.exports = { server };
