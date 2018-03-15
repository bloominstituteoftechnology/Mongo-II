const express = require('express');
const Post = require('./post.js');

const server = express();
server.use(express.json());

server.get('/accepted-answer/:soID', (req, res) => {
  const { soID } = req.params;
  if (!soID) {
    res.status(400).json({ error: `Please provide an ID` });
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

server.get('/top-answer/:soID', (req, res) => {
  const { soID } = req.params;
  if (!soID) {
    res.status(400).json({ error: `Please provide an ID` });
  }
  Post.findOne({ soID: soID })
    .then(found => {
      if (found === null) {
        res.status(404).json({ error: `The specified ID does not exist` });
      }
      Post.find({ parentID: soID, soID: { $ne: found.acceptedAnswerID } })
        .sort({ score: 'desc' })
        .exec((err, answer) => {
          if (answer === null) {
            res.status(404).json({ error: `No top answer exists` });
          }
          res.status(200).json({ topAnswer: answer[0] });
        });
      })
    .catch(err => {
      res.status(500).json({ error: `The information could not be retrieved` });
    });
});

server.get('/popular-jquery-questions', (req, res) => {
  Post.find({ 
    tags: 'jquery', 
    parentID: null,
    $or: [ { score: { $gt: 5000 } }, { 'user.reputation': { $gt: 200000 } } ],
  })
    .exec((err, answers) => {
      if (answers.length === 0) {
        res.status(404).json({ error: `No posts with jquery in the tag, with a score > 5000 or user rep > 200,000, exist` });
      }
      res.status(200).json({ test: answers })
      if (err) {
        res.status(500).json({ error: 'The information could not be retrieved' });
      }
    });
});

server.get('/npm-answers', (req, res) => {
  Post.find({ tags: 'npm' }, 
    (err, posts) => {
      if (posts.length === 0 || err) {
        res.status(500).json({ error: 'There was an error retrieving the data'});
      }
      Post.find({ parentID: { $in: posts.map(post => post.soID) } })
        .exec((err, posts) => {
          if (posts.length === 0 || err) {
            res.status(500).json({ error: 'There was an error retrieving the data'});
          }
          res.status(200).json({ return: posts });
        });
      
    // if (answers.length === 0) {
    //   res.status(404).json({ error: `No posts with jquery in the tag, with a score > 5000 or user rep > 200,000, exist` });
    // }
    // res.status(200).json({ test: answers })
    // if (err) {
    //   res.status(500).json({ error: 'The information could not be retrieved' });
    // }
      });
});

module.exports = { server };
