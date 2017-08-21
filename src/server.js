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

server.get('/popular-jquery-questions', (req, res) => {
  Post.find({ $and: [{ tags: { $in: ['jquery'] } },
    { $or: [{ score: { $gt: 5000 } },
    { 'user.reputation': { $gt: 200000 } }] }] })
    .exec((err, post) => {
      if (!post) {
        sendUserError(err, res);
        return;
      }
      res.json(post);
    });
});

server.get('/npm-answers', (req, res) => {
  const idArr = [];
  Post.find({ tags: 'npm' }, { soID: 1, _id: 0 })
  .exec((err, questions) => {
    if (!questions) {
      sendUserError(err, res);
      return;
    }
    questions.forEach((obj) => {
      idArr.push({ parentID: obj.soID });
    });
    Post.find({ $or: idArr })
    .exec((error, answers) => {
      if (!answers) {
        sendUserError(error, res);
        return;
      }
      res.json(answers);
    });
  });
});


module.exports = { server };
