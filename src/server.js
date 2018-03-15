const bodyParser = require('body-parser');
const express = require('express');

const Post = require('./post.js');

const STATUS_USER_ERROR = 422;

const server = express();
// to enable parsing of json bodies for post requests

server.use(bodyParser.json());

// TODO: write your route handlers here
server.get('/accepted-answer/:soID', (req, res) => {
    const { soID } = req.params;
    Post.findOne({ soID }, (err1, foundPost) => {
      if (!foundPost) {
        res.status(STATUS_USER_ERROR).json({msg: 'There is no post found by that soID', error: err1});
        return;
      }
      Post.findOne(
        { soID: foundPost.acceptedAnswerID },
        (err2, acceptedAnswer) => {
          if (err2 || acceptedAnswer === null) {
            res.status(STATUS_USER_ERROR).json({msg: 'There is no post found by that soID', error: err1});
            return;
          }
          res.json(acceptedAnswer);
        },
      );
    });
    // findOne document by the given id;
  });

  server.get('/top-answer/:soID', (req, res) => {
    const { soID } = req.params;
    Post.findOne({ soID }, (err, post) => {
      if (!post) {
        res.status(STATUS_USER_ERROR).json({msg: 'There is no post found by that soID', error: err});
        return;
      }
      Post.findOne({ soID: { $ne: post.acceptedAnswerID }, parentID: soID })
        .sort({ score: 'desc' })
        .exec((err2, sortedAnswer) => {
          if (!sortedAnswer) {
            res.status(STATUS_USER_ERROR).json({msg: 'Answer not found', error: err2});
            return;
          }
          res.json(sortedAnswer);
        });
    });
  });

  server.get('/popular-jquery-questions', (req, res) => {
    Post.find({
      parentID: null,
      tags: 'jquery',
      $or: [{ score: { $gt: 5000 } }, { 'user.reputation': { $gt: 200000 } }],
    }).exec((err, posts) => {
      if (err || posts.length === 0) {
        res.status(STATUS_USER_ERROR).json({error: err});
        return;
      }
      res.json(posts);
    });
  });

  server.get('/npm-answers', (req, res) => {
    Post.find(
      {
        tags: 'npm',
      },
      (err, questions) => {
        if (err || questions.length === 0) {
            res.status(STATUS_USER_ERROR).json({error: err});
          return;
        }
        Post.find({
          parentID: { $in: questions.map(question => question.soID) },
        }).exec((err1, answers) => {
          if (err1 || answers.length === 0) {
            res.status(STATUS_USER_ERROR).json({error: err1});
            return;
          }
          res.json(answers);
        });
        // loop over array of questions
        // match where questions soID === parentID
      },
    );
  });

module.exports = { server };
