const bodyParser = require('body-parser');
const express = require('express');

const Post = require('./post.js');

const STATUS_USER_ERROR = 422;
const STATUS_SUCCESS = 200;

const server = express();
// to enable parsing of json bodies for post requests

server.use(bodyParser.json());

const errHandler = (res, error) => {
  res.status(STATUS_USER_ERROR).json({ error });
};

// TODO: write your route handlers here
server.get('/accepted-answer/:soID', (req, res) => {
  const { soID } = req.params;

  Post.findOne({ soID })
    .select('acceptedAnswerID')
    .exec((err1, post) => {
      if (err1 || !post) return errHandler(res, 'badID');

      Post.findOne({ soID: post.acceptedAnswerID }, (err2, answer) => {
        if (err2 || !answer) return errHandler(res, 'no accepted answer');

        res.status(STATUS_SUCCESS).json(answer);
      });
    });
});

server.get('/top-answer/:soID', (req, res) => {
  const { soID } = req.params;

  Post.findOne({ soID })
    .select('acceptedAnswerID')
    .exec((err1, answerID) => {
      if (err1) return errHandler(res, 'bad ID');

      Post.findOne({ soID: { $ne: answerID.acceptedAnswerID }, parentID: soID })
        .sort({ score: 'desc' })
        .exec((err2, post) => {
          if (err2 || !post) return errHandler(res, 'no top answer');

          res.status(STATUS_SUCCESS).json(post);
        });
    });
});

server.get('/popular-jquery-questions', (req, res) => {
  Post.find({
    tags: 'jquery',
    $or: [{ score: { $gt: 5000 } }, { 'user.reputation': { $gt: 200000 } }],
  })
    .exec((err, posts) => {
      if (err) return errHandler(res, 'no posts found');

      res.status(STATUS_SUCCESS).json(posts);
    });
});

server.get('/npm-answers', (req, res) => {
  Post.find({ tags: 'npm' })
    .select('soID')
    .exec((err, posts) => {
      if (err || posts.length === 0) return errHandler(res, 'no posts found');

      posts = posts.map(val => val.soID);

      Post.find({ parentID: { $in: posts } })
        .exec((err2, answers) => {
          if (err2) return errHandler(res, err2.message);
          return res.status(STATUS_SUCCESS).json(answers);
        });
    });
});
module.exports = { server };
