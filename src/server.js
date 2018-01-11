const bodyParser = require('body-parser');
const express = require('express');

const Post = require('./post.js');

const STATUS_USER_ERROR = 422;

const server = express();
// to enable parsing of json bodies for post requests

server.use(bodyParser.json());

// TODO: write your route handlers here
const errorMessage = (res, status) => {
  return res.status(status).json({ error: 'You did something wrong' });
};

server.get('/', (req, res) => {
  res.send('this server is working');
});

server.get('/accepted-answer/:soID', (req, res) => {
  const { soID } = req.params;
  Post.findOne({ soID }, (err, data) => {
    if (err || !data || !data.acceptedAnswerID) return errorMessage(res, 422);
    Post.findOne({ soID: data.acceptedAnswerID }, (errTwo, acceptedData) => {
      if (errTwo || !acceptedData) return errorMessage(res, 422);
      res.json(acceptedData);
    });
  });
});

server.get('/top-answer/:soID', (req, res) => {
  const { soID } = req.params;
  Post.findOne({ soID }, (err, data) => {
    if (err || !data) return errorMessage(res, 422);
    Post.findOne({ soID: { $ne: data.acceptedAnswerID }, parentID: soID })
      .sort({ score: -1 })
      .then((dataTwo) => {
        if (!dataTwo) return errorMessage(res, 422);
        res.json(dataTwo);
      })
      .catch((errTwo) => {
        if (errTwo) return errorMessage(res, 422);
      });
  });
});

server.get('/popular-jquery-questions', (req, res) => {
  Post.find({ tags: 'jquery', $or: [{ score: { $gt: 5000 } }, { 'user.reputation': { $gt: 200000 } }] })
    .then((data) => {
      if (!data) return errorMessage(res, 422);
      res.json(data);
    })
    .then((err) => {
      if (err) return errorMessage(res, 422);
    });
});

server.get('/npm-answers', (req, res) => {
  Post.find({ tags: 'npm' })
    .then((data) => {
      if (!data) return errorMessage(res, 422);
      Post.find({ parentID: { $in: data.map(loop => loop.soID) } })
        .then((dataTwo) => {
          if (!dataTwo) return errorMessage(res, 422);
          res.json(dataTwo);
        });
    })
    .catch((err) => {
      if (err) return errorMessage(res, 422);
    });
});
module.exports = { server };
