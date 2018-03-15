const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');

const Posts = require('./post.js');

const STATUS_USER_ERROR = 422;

const server = express();
// to enable parsing of json bodies for post requests

server.use(bodyParser.json());

server.get('/accepted-answer/:soID', (req, res) => {
  if(req.params.soID.match(/^[0-9]+$/) === null) {
    res.status(422).send({ errorMsg: 'Please input a valid stack overflow question id' });
    return;
  }
  const questionId = req.params.soID;
  Posts.findOne({ 'soID': questionId })
    .then(question => {
      if(question) {
        Posts.findOne({ 'soID': question.acceptedAnswerID })
          .then(answer => {
            res.status(200).send({ question: question, answer: answer });
          })
          .catch(err => {
            res.status(500).send({ errorMsg: 'There was an error fetching the accepted answer.', error: err });
          });
      } else {
        res.status(404).send({ message: 'This question was not found' });
      }
    })
    .catch(err => {
      console.error('error', err);
    })
});

server.get('/top-answer/:soID', (req, res) => {
  if(req.params.soID.match(/^[0-9]+$/) === null) {
    res.status(422).send({ errorMsg: 'Please input a valid stack overflow question id' });
    return;
  }
  const questionId = req.params.soID;
  Posts.findOne({ 'soID': questionId })
    .then(question => {
      if(question) {
        const acceptedAnswer = question.acceptedAnswerID;
        Posts.findOne({ 'parentID': questionId, 'soID': { $ne: acceptedAnswer } })
          .sort({ score: -1 })
          .then(top => {
            res.status(200).send(top);
          })
          .catch(err => {
            res.status(500).send({ errorMsg: 'There was an error fetching the top answer.', error: err });
          });
      } else {
        res.status(404).send({ message: 'This question was not found' });
      }
    })
    .catch(err => {
      res.status(500).send({ errorMsg: 'There was an error fetching the top answer.', error: err });
    });
});

server.get('/popular-jquery-questions', (req, res) => {
  Posts.find({ 'tags': { $all: 'jquery'}, $or: [{ 'score': { $gt: 5000 }}, { 'user.reputation': { $gt: 200000 }} ] } )
    .then(posts => {
      res.status(200).send(posts);
    })
    .catch(err => {
      res.status(500).send({ errorMsg: 'There was an error fetching the most popular jquery questions.', error: err });
    });
});

server.get('/npm-answers', (req, res) => {
  Posts.find({ 'tags': { $all: 'npm'} })
    .then(questions => {
      Posts.find({ 'parentID': { $in: questions.map(questions => questions.soID) } })
        .then(answers => {
          res.status(200).send(answers);
        })
        .catch(err => {
          res.status(400).send({ message: 'Error finding answers to the npm questions' });
        });
    })
    .catch(err => {
      res.status(400).send({ message: 'Error finding questions tagged npm' });
    });
});

module.exports = { server };
