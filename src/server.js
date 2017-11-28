const bodyParser = require('body-parser');
const express = require('express');

const Post = require('./post.js');

const STATUS_USER_ERROR = 422;
const STATUS_SUCCESS = 200;

const server = express();
// to enable parsing of json bodies for post requests

server.use(bodyParser.json());

// TODO: write your route handlers here
server.get('/accepted-answer/:soID', (req, res) => {
  const { soID } = req.params;

  Post.findOne({ soID })
    .select('acceptedAnswerID')
    .exec((err1, post) => {
      if (err1 || post === null) {
        return res.status(STATUS_USER_ERROR).json('Bad ID');
      }

      Post.findOne({ soID: post.acceptedAnswerID }, (err2, answer) => {
        if (err2 || answer === null) {
          return res.status(STATUS_USER_ERROR).json('no accepted answer');
        }
        res.status(STATUS_SUCCESS).json(answer);
      });
    });
});

server.get('/top-answer/:soID', (req, res) => {
  const { soID } = req.params;

  Post.findOne({ soID })
    .select('acceptedAnswerID')
    .exec((err1, answerID) => {
      if (err1) return res.status(STATUS_USER_ERROR).json('bad id');

      Post.find({ parentID: soID })
        .sort({ score: 'desc' })
        .exec((err2, posts) => {
          if (err2 || posts.length === 0) {
            return res.status(STATUS_USER_ERROR).json('no top answer');
          }
          const foundpost = posts.find(post => post.soID !== answerID.acceptedAnswerID);
          return res.status(STATUS_SUCCESS).json(foundpost);
        });
    });
});

server.get('/popular-jquery-questions', (req, res) => {
  Post.find({
    $and: [
      { tags: { $in: ['jquery'] } },
      { $or: [
        { score: { $gt: 5000 } },
        { 'user.reputation': { $gt: 200000 } }
      ] }
    ]
  }, (err, posts) => {
    if (err) return res.status(STATUS_USER_ERROR).json('no posts found');
    return res.status(STATUS_SUCCESS).json(posts);
  });
});

server.get('/npm-answers', (req, res) => {
  Post.find({ tags: { $in: ['npm'] } })
    .select('soID')
    .exec((err, posts) => {
      if (err || posts.length === 0) {
        return res.status(STATUS_USER_ERROR).json('no posts found');
      }
      const arrPosts = posts.map(val => val.soID);
      Post.find({ parentID: { $in: arrPosts } }, (err2, answers) => {
        if (err) return res.status(STATUS_USER_ERROR).json('err');
        const test = answers.map(answer => [answer.soID, answer.parentID]);
        return res.status(STATUS_SUCCESS).json(answers);
      });
    });
});
module.exports = { server };
