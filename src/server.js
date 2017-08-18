const bodyParser = require('body-parser');
const express = require('express');

const STATUS_USER_ERROR = 422;
const Post = require('./post.js');

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());

// TODO: write your route handlers here
server.get('/accepted-answer/:soID', (req, res) => {
  const { soID } = req.params;
  Post.findOne({ soID })
    .exec((err, post) => {
      if (!post) {
        res.status(STATUS_USER_ERROR);
        res.json({ error: 'User Error in accepted-answer' });
        return;
      }
      Post.findOne({ soID: post.acceptedAnswerID })
        .exec((error, answer) => {
          if (!answer) {
            res.status(STATUS_USER_ERROR);
            res.json({ error: 'User Error in accepted-answer findOne' });
            return;
          }
          res.json(answer);
        });
    });
});

module.exports = { server };
