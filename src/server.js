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
  const question = Post.findOne({ soID }, (err, post) => {
    if (err) {
      res.status(STATUS_USER_ERROR).json({ error: err });
      return;
    }

    const { acceptedAnswerID } = post;

    if (!acceptedAnswerID) {
      res
        .status(STATUS_USER_ERROR)
        .json({ error: 'Question does not have an accepted answer' });
      return;
    }

    const answer = Post.findOne({ soID: acceptedAnswerID }, (e, ansr) => {
      if (e) {
        res.status(STATUS_USER_ERROR).json({ error: e });
        return;
      }
      res.json(ansr);
    });
  });
});

server.get('/top-answer/:soID', async (req, res) => {
  const { soID } = req.params;

  try {
    const question = await Post.findQuestion(soID);
    if (question) {
      const topAnswer = await Post.getTopAnswer(question.soID, question.acceptedAnswerID);
      return topAnswer ? res.json(topAnswer) : res.status(STATUS_USER_ERROR).json({ error: 'no answer' });
    }
    res.status(STATUS_USER_ERROR).json({ error: 'ID does not match question' });
  } catch (e) {
    console.log('catch error: ', e);
    res.status(STATUS_USER_ERROR).json({ error: e });
  }

  return;
});

server.get('/popular-jquery-questions', async (req, res) => {
  try {
    const questions = await Post.findQuestions({
      parentID: null,
      tags: 'jquery',
      $or: [{ score: { $gt: 5000 } }, { 'user.reputation': { $gt: 200000 } }],
    });
    res.json(questions);
  } catch (e) {
    res.status(STATUS_USER_ERROR).json({ error: e });
  }
  return;
});

server.get('/npm-answers', async (req, res) => {
  try {
    const questions = await Post.findQuestions({ tags: 'npm' });
    const answers = await Post.findAnswers({ $in: questions.map(question => question.soID) });
    res.json(answers);
  } catch (e) {
    res.status(STATUS_USER_ERROR).json({ error: e });
  }
  return;
});

module.exports = { server };
