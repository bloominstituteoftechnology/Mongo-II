const bodyParser = require('body-parser');
const express = require('express');

const Post = require('./post.js');

const STATUS_USER_ERROR = 422;

const server = express();
// to enable parsing of json bodies for post requests

server.use(bodyParser.json());

server.get('/accepted-answer/:soID', function(req, res) {
  const { soID } = req.params;
  if (!soID) {
    res.status(400).json({ error: `Please provide a numerical ID` });
  }
  Post.findOne({ soID: soID })
    .then(found => {
      if (found === null) {
        res.status(404).json({ error: `The specified ID does not exist` });
      }
      Post.findOne({ soID: found.acceptedAnswerID })
        .then(answer => {
          if (answer === null) {
            res.status(404).json({ error: `No accepted answer exists` });
          }
          res.status(200).json({ acceptedAnswer: answer });          
        })
    })
    .catch(err => {
      res.status(500).json({ error: `The information could not be retrieved` });
    });
});

module.exports = { server };
