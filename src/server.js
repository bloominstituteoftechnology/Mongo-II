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
  if (isNaN(soID) || soID === null) {
    res.status(422).json({ err: 'bad id' });
    return;
  }
  Post.findOne({ soID, parentID: null }, (err, question) => {
    if (err || question === null) {
      res.status(STATUS_USER_ERROR).json({ 'There is no question with given soID: ': err });
      return;
    }
    const accepted = question.acceptedAnswerID;
    if (accepted === null) {
      res.status(404).json({ err: 'There is no accepted answer' });
      return;
    }
    Post.findOne({ soID: accepted, parentID: soID }, (error, answer) => {
      if (error || answer === null) {
        res.status(500).json({ 'Could not find answer by that acceptedAnswerID': error });
        return;
      }
      res.status(200).json(answer);
    });
  });
});

server.get('/top-answer/:soID', (req, res) => {
  const { soID } = req.params;
  if (isNaN(soID)) {
    res.status(STATUS_USER_ERROR).json({ err: 'bad id' });
    return;
  }
  Post.findOne({ soID, parentID: null }, (err, question) => {
    if (err || question === null) {
      res.status(422).json({ 'Error getting a question: ': err });
      return;
    }
    Post
      .find({ parentID: soID, soID: { $ne: question.acceptedAnswerID } })
      .sort({ score: -1 }).exec((error, sortedAnswers) => {
        if (error) {
          res.status(500).json({ 'Error getting sorting answers: ': error });
          return;
        }
        res.status(200).json(sortedAnswers[0]);
      });
  });
});

server.get('/popular-jquery-questions', (req, res) => {
  Post.find({ tags: { $in: ['jquery'] }, $or: [{ score: { $gt: 5000 } }, { 'user.reputation': { $gt: 200000 } }] }, (err, questions) => {
    if (err) {
      res.status(422).json({ 'Error getting questions: ': err });
      return;
    }
    res.status(200).json(questions);
  });
});

server.get('/npm-answers', (req, res) => {
  Post.find({ tags: { $in: ['npm'] } }, (err, questions) => {
    if (err) {
      res.status(422).json({ 'Error getting questions: ': err });
      return;
    }
    const answersId = questions.map((item) => { return item.soID; });
    Post.find({ parentID: { $in: answersId } }, (error, answers) => {
      if (error) {
        res.status(422).json({ 'Error getting answers: ': error });
        return;
      }
      res.status(200).json(answers);
    });
  });
});

module.exports = { server };
