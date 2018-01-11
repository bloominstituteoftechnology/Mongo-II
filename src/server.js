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
    .then((post) => {
      return Post.find({ soID: post.acceptedAnswerID.toString() });
    })
    .then((post) => {
      if (post === 'undefined') {
        res.status(STATUS_USER_ERROR).json({ error: 'ID Not Found' });
      } else {
        res.status(200).json(post);
      }
    })
    .catch((err) => {
      res.status(500).json({ error: 'Error getting data' });
    });
});

server.get('/top-answer/:soID', (req, res) => {
  const id = req.params.soID;
  Post.find({ parentID: id }, { score: 1 })
    .sort({ score: -1 })
    .then((post) => {
      return Post.findOne({ score: { $ne: post[0].score } });
    })
    .then((post) => {
      res.status(200).json(post);
    })
    .catch((err) => {
      res.status(500).json({ error: 'Error getting data' });
    });
});

server.get('/popular-jquery-questions', (req, res) => {
  Post.find({ tags: 'jquery', $or: [{ score: { $gt: 5000 } }, { 'user.reputation': { $gt: 200000 } }] })
    // Post.find({ tags: { $in: ['jquery'] } })
    // .where({ $or: [{ score: { $gt: 5000 } }, { 'user.reputation': { $gt: 200000 } }] })
    // .gt(5000)
    // .where('user.reputation')
    // .gt(200000)
    .then((post) => {
      res.status(200).json(post);
    })
    .catch((error) => {
      res.status(500).json({ error: "Couldn't retrieve the data" });
    });
});

server.get('/npm-answers', (req, res) => {
  Post.find({ parentID: null, tags: 'npm' }).then((posts) => {
    const soIDArr = posts.map(p => p.soID);
    Post.find()
      .then((post) => {
        const results = post.filter(p => soIDArr.includes(p.parentID));
        res.status(200).json(results);
      })
      .catch((error) => {
        res.status(500).json({ message: 'None found!', error });
      });
  });
});

module.exports = { server };
