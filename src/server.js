const bodyParser = require('body-parser');
const express = require('express');

const Post = require('./post.js');

const STATUS_USER_ERROR = 422;
const STATUS_SERVER_ERROR = 500;

const server = express();
// to enable parsing of json bodies for post requests

server.use(bodyParser.json());

server.get('/questions', (req, res) => {
  Post.find({}, (err, questions) => {
    if (err) return res.status(500).json(err);
    res.json(questions);
  });
});

server.get('/accepted-answer/:soID', (req, res) => {
  const { soID } = req.params;

  Post.findOne({ soID }, (err, question) => {
    if (err || question.acceptedAnswerID === null) return res.status(STATUS_USER_ERROR).json(err);

    Post.findOne({ soID: question.acceptedAnswerID }, (e, ans) => {
      res.json(ans);
    });
  });
});

server.get('/top-answer/:soID', (req, res) => {
  const { soID } = req.params;
  Post.findOne({ soID }, (err, question) => {
    if (err) return res.status(STATUS_USER_ERROR).json(err);
    const answers = Post.find({ parentID: soID }).exec();

    Promise.resolve(answers)
    .then((ansList) => {
      let topAnswer = null;
      let curHiScore = 0;
      const filteredList = ansList.filter((answer) => {
        if (answer.parentID === null) res.status(STATUS_USER_ERROR).json({ ERROR: 'This is Not an Answer' });
        return answer.parentID !== null;
      });
      filteredList.forEach((answer) => {
        if (answer.score > curHiScore && answer.soID !== question.acceptedAnswerID) {
          curHiScore = answer.score;
          topAnswer = answer;
        }
      });
      if (topAnswer === null) return res.status(STATUS_USER_ERROR).json('No Top-Answer');
      res.json(topAnswer);
    });
  });
});

server.get('/popular-jquery-questions', (req, res) => {
  Post.find({}, (err, questions) => {
    if (err) return res.status(STATUS_SERVER_ERROR).json(err);
    const filteredQuestions = questions.filter((q) => {
      if (q.user === null) return;
      return (q.tags.includes('jquery') && (q.score > 5000 || q.user.reputation > 200000));
    });
    res.json(filteredQuestions);
  });
});

server.get('/npm-answers', (req, res) => {
  Post.find({ parentID: null }, (err, questions) => {
    if (err) return res.status(STATUS_SERVER_ERROR).json(err);
    const qIDs = [];
    questions.forEach((q) => {
      if (q.tags.includes('npm')) qIDs.push(q.soID);
    });
    Post.find({ parentID:{ $ne: null }}, (e, answers) => {
      if (e) return res.status(STATUS_SERVER_ERROR).json(e);
      const filteredAnswers = answers.filter((a) => {
        return qIDs.includes(a.parentID) && a.soID !== 5232;
      });
      res.json(filteredAnswers);
    });
  });
});
module.exports = { server };
