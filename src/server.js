const bodyParser = require('body-parser');
const express = require('express');

const STATUS_USER_ERROR = 422;

const Post = require('./post');

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());

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
// We are providing the database the soID
// We are saving the soID the client provides as a const.
//
server.get('/top-answer/:soID', (req, res) => {
  const { soID } = req.params;
  Post.findOne({ soID })
    .exec((err, post) => {
      if (!post) {
        sendUserError(err, res);
        return;
      } // we now have the right question
      // searching db w/ find for (all) parentID === soID
      Post.find({ parentID: soID })
      .sort({ score: -1 })
      .exec((error, answer) => {
        if (!answer || post.parentID) {
          sendUserError(error, res);
          return;
        } else if (post.acceptedAnswerID === null) {
          res.json(answer[0]);
        }
        res.json(answer[1]);
      });
    });
});

// Find all question posts that are tagged with jquery and either have a score greater than 5000,
// or are posted by a user with reputation greater than 200,000 (1 query).
// Send back a JSON response with an array of popular jquery questions.

server.get('/popular-jquery-questions', (req, res) => {
  Post.find({}, (err, post) => {
    if (err) {
      res.status(STATUS_USER_ERROR);
      res.json(err);
      return;
    }
    res.json(post);
    // if (post.tags.includes('jquery') &&
    //   post.score > 5000 &&
    //   post.user.reputation > 200000) {
    //   res.json(post);
    // }
    // post []
    // .forEach {}
    // obj[tags]
    // .includes

  });
});

module.exports = { server };
