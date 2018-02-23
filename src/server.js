/* eslint-disable */

const bodyParser = require('body-parser');
const express = require('express');

const Post = require('./post.js');

const STATUS_USER_ERROR = 422;

const server = express();
// to enable parsing of json bodies for post requests

server.use(bodyParser.json());

// TODO: write your route handlers here

// server.get('/post/:soID', (req, res) => {
//   Post.find({ parentID: req.params.soID })
//     .sort({ acceptedAnswerID: 1 })
//     .then(posts => res.json(posts))
//     .catch(err => res.status(422).json(err));
// });

server.get('/accepted-answer/:soID', (req, res) => {
  Post.findOne({ soID: req.params.soID })
    .then(post => {
      if (post.acceptedAnswerID === null) {
        res.status(422).json({ error: 'No accepted answer.' });
        return;
      }

      Post.findOne({ soID: post.acceptedAnswerID })
        .then(postAnswer => res.status(200).json(postAnswer))
        .catch(err => res.status(422).json(err));
    })
    .catch(error => {
      res.status(422).json(error);
    });
});

server.get('/top-answer/:soID', (req, res) => {
  Post.findOne({ soID: req.params.soID }).then(post => {
    if (post === null) {
      res.status(422).json({error: `No post with id ${req.params.soID} was found.`})
      return;
    }

    const answerId =
      post.acceptedAnswerID !== null ? post.acceptedAnswerID : 'no answer';

    Post.findOne({ parentID: req.params.soID })
      .where('soID')
      .ne(answerId)
      .sort({ score: -1 })
      .then(post => {
        res.status(200).json(post);
      });
  });
});

module.exports = { server };
