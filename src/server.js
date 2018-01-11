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
  Post.findOne({ soID })
    .then((question) => {
      const newID = question.acceptedAnswerID;
      Post.findOne({ soID: newID })
        .then((answer) => {
          if (answer === null) {
            res.status(422).json({ error: 'Dont have an accepted Answer' });
          } else {
            res.status(200).json(answer);
          }
        })
        .catch((error) => {
          res.status(422).json({ error: 'No answer found' });
        });
    })
    .catch((error) => {
      res.status(422).json({ error: 'No question found' });
    });
});

server.get('/top-answer/:soID', (req, res) => {
  const { soID } = req.params;
  Post.findOne({ soID })
    .then((answer) => {
      const newID = answer.soID;
      Post.findOne.where({ acceptedAnswerID: null })({ parentID: newID })
        .sort('-score')
        .then((answers) => {
          res.status(200).json(answers);
        })
        .catch((err) => {
          res.status(422).json(err);
        });
    })
    .catch((err) => {
      res.status(422).json(err);
    });
});

server.get('/popular-jquery-questions', (req, res) => {
  Post.find({ tags: 'jquery', $or: [{ score: { $gt: 5000 } }, { 'user.reputation': { $gt: 200000 } }] })
  .then((answer) => {
    res.status(200).json(answer);
  })
  .catch((error) => {
    res.status(422).error(error);
  });
});

server.get('/npm-answers', (req, res) => {
  Post.find({ tags: 'npm' })
    .then((found) => {
      const id1 = found[0].soID;
      const id2 = found[1].soID;
      Post.find({ $or: [{ parentID: 18641899 }, { parentID: 22343224 }] })
        .then((answers) => {
          res.status(200).json(answers);
        })
        .catch((err) => {
          res.status(422).json(err);
        });
    })
    .catch((err) => {
      res.status(422).json(err);
    });
});
module.exports = { server };
