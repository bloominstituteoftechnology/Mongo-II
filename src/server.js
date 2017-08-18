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
  Post.find({}, (err, results) => {
    if (err) {
      throw err;
      return;
    }
    res.json(results);
  });
});

server.get('/accepted-answer/:soID', (req, res) => {
  const id = req.params.soID;
  let acceptedAnswerID;
  Post.find({soID:id})
    .select('acceptedAnswerID')
    .exec((err, answer) => {
      if (err) {
        res.status(STATUS_SERVER_ERROR);
        res.json({error: err});
        return;
      }
      acceptedAnswerID = (answer[0].acceptedAnswerID);
    }).then(() => {
    Post.find({ soID : acceptedAnswerID }, (err, ans) => {
      if (err) {
        res.status(STATUS_SERVER_ERROR);
        res.json({error: err});
        return;
      }
      console.log(ans);
      res.json(ans[0]);
    })});
});

module.exports = { server };
