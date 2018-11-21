const bodyParser = require('body-parser');
const express = require('express');
const { populatePosts } = require('./populate.js');

const Post = require('./post.js');

const STATUS_USER_ERROR = 422;

const server = express();
// to enable parsing of json bodies for post requests

server.use(bodyParser.json());

// TODO: write your route handlers here
server.get('/accepted-answer/:soID', (req, res) => {
  const { id } = req.params;
  Post.find({ soID: id })
    .then(post => {
      const answerID = post.acceptedAnswerID
      Post.find({ soID: answerID })
        .then(post => {
          res.status(200).json({AcceptedAnswer: post})
        })
        .catch(err => {
          res.status(500).json(err);
        })
    })
    .catch(err => {
      res.status(400).json(err);
    })
})

server.get('/top-answer/:soID', (req, res) => {
  const { id } = req.params;
  Post.find({ soID: id })
    .then(post => {
      const parentID = post.parentID;
      const answerID = post.acceptedAnswerID;
      Post.find({ parentID: id }).sort({ score: -1 })
        .then(posts => {
          const topAnswerID = posts[0].soID;
          if(parentID === null && topAnswerID !== answerID) {
            res.status(200).json(posts[0])
          } else if (parentID === null && topAnswerID === acceptedAnswerID) {
            res.status(404).json({message: 'Top Answer is Accepted Answer'})
          }
        })
    })
    .catch(err => {
      res.status(500).json({ message: 'Error' })
    })
})

server.get('/popular-jquery-questions', (req, res) => {
  Post.find({ tags: 'jquery' })
    .then(posts => {
      const questions = posts.filter(post => {
        (post.score > 5000 || post.user.reputation > 200000)
      })
      res.status(200).json(questions);
    })
    .catch(err => {
      res.status(500).send({ error: 'error' })
    })
});

server.get('/npm-answers', (req, res) => {
  Post.find({ parentID: null, tags: 'npm' })
    .then(posts => {
        const soIds = posts.map(post => {
          return post.soID;
        });
        Post.find({ parentID: { $in: soIds } })
          .then(answers => {
            res.json(answers)
          })
      })
      .catch(err => {
        res.status(500).json({ error: err });
      })
})

module.exports = { server };
