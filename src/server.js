const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');

const Post = require('./post.js');

const STATUS_USER_ERROR = 422;

const server = express();
// to enable parsing of json bodies for post requests

server.use(bodyParser.json());

server.get('/', (req, res) => {
  /* res.status(200).json({ api: 'running' });  OURS, original */
  Post.find()
    .limit(10)
    .then((results) => {
      res.status(200).json(results);
    })
    .catch((err) => {
      res.status(500).json({ error: 'No way!' });
    });
});

// TODO: write your route handlers here

server.get('/top-answer', (req, res) => {
  Post.find({})
    .then((answers) => {
      res.status(200).json(answers);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
});

server.get('/accepted-answer/:soID', (req, res) => {
  const { soID } = req.params;
  Post.findOne({ soID })
    .select('acceotedAnswerID')
    .then((result) => {
      Post.findOne({ soID: result.acceptedAnswerID })
        .then((answer) => {
          res.status(200).json(answer);
        })
        .catch((err) => {
          res.status(404).json({ error: 'ID could not be found' });
        });
    })
    .catch((err) => {
      res.status(500).json({ error: 'Server could not be reached' });
    });
});

server.get('/top-answer/:soID', (req, res) => {
  // find the question with the given soID
  const { soID } = req.params;
  // Find the answer of the given question that has the highest score that is not the accepted answer
  Post.findOne({ soID })
    .then((result) => {
      const acceptedAnswer = result.acceptedAnswerID;
      Post.find({ parentID: soID })
        .sort('-score')
        .then((results) => {
          if (results[0].soID === acceptedAnswer) {
            res.status(200).json(results[1]);
          } else {
            // Send back a JSON response iwth the single top answer
            result.status(200).json(results[0]);
          }
        })
        .catch();
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json({ err });
    });
});

server.get('/popular-jquery-questions', (req, res) => {
  Post.find({
    tags: 'jquery',
    $or: [{ 'user.reputation': { $gt: 200000 } }, { score: { $gt: 5000 } }]
  })
    .then((results) => {
      res.send(results);
    })
    .catch((err) => {
      res.send(err);
    });
});

server.get('/npm-answers', (req, res) => {
  Post.find()
    .where('tags')
    .in('npm')
    .then((results) => {
      const soIdsArray = results.map((post) => {
        return { parentID: post.soID };
      });
      res.send(soIdsArray);
      Post.find(soIdsArray)
      .or(soIdsArray)
        .then((answers) => {
          res.send(answers);
        })
        .catch((err) => {
          res.send({ err: 'no workey!' });
        });
    })
    .catch((err) => {
      res.send({ err: "didn't work" });
    });
});

module.exports = { server };
