const bodyParser = require('body-parser');
const express = require('express');

const Post = require('./post.js');

const STATUS_USER_ERROR = 422;
const STATUS_SERVER_ERROR = 500;

const server = express();
// to enable parsing of json bodies for post requests

server.use(bodyParser.json());

// TODO: write your route handlers here
server.get('/posts', (req, res) => {
  Post.find( {}, (err, posts) => {
    if (err) {
      res.status(STATUS_SERVER_ERROR).json({ 'There was an error getting posts': err });
      return;
    }
    res.json(posts);
  });
});

// server.get('/posts/accepted-answer/503093', (req, res) => {
//   Post.find( { $and: [ {"parentID":503093, "soID": 506004} ] }, (err, posts) => {
//     if (err) {
//       res.status(STATUS_SERVER_ERROR).json({ 'There was an error getting posts': err });
//       return;
//     }
//     res.json(posts);
//   });
// });

server.get('/posts/accepted-answer/:soID', (req, res) => {
  let { id } = req.params;
  Post.findById(id).select('answers').exec((err, answers) => {
    if (err) {
      res.status(STATUS_USER_ERROR).json({ 'You suck at getting ids of things': err });
      return;
    }
    res.json(answers);
  });
});

module.exports = { server };
