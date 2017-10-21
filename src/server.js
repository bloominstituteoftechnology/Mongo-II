const bodyParser = require('body-parser');
const express = require('express');

const Post = require('./post.js');

const STATUS_USER_ERROR = 422;

const server = express();
// to enable parsing of json bodies for post requests

server.use(bodyParser.json());

const handleError = (res, status, msg) => {
  return res.status(status).json({ err: msg });
};

server.get('/accepted-answer/:soID', async (req, res) => {
  const { soID } = req.params;
  try {
    const question = await Post.findOne({ soID });
    const answer = await Post.find({ soID: question.acceptedAnswerID });
    if (!answer.length) {
      throw new Error('Post has no accepted answer');
    }
    return res.json(answer[0]);
  } catch (error) {
    return handleError(res, STATUS_USER_ERROR, 'Post not found');
  }
});

server.get('/top-answer/:soID', async (req, res) => {
  const { soID } = req.params;
  try {
    const question = await Post.findOne({ soID });
    const answer = await Post.find()
      .where({ parentID: question.soID })
      .where('soID')
      .ne(question.acceptedAnswerID)
      .sort({ score: -1 })
      .limit(1);

    if (!answer.length) {
      throw new Error('Post not found');
    }
    return res.json(answer[0]);
  } catch (error) {
    return handleError(res, STATUS_USER_ERROR, 'Post not found');
  }
});

server.get('/popular-jquery-questions', async (req, res) => {
  try {
    const questions = await Post.find({
      $or: [{ score: { $gt: 5000 } }, { 'user.reputation': { $gt: 200000 } }],
    }).where({ tags: { $in: ['jquery'] } });
    return res.json(questions);
  } catch (error) {
    return handleError(res, STATUS_USER_ERROR, 'Something went wrong');
  }
});

server.get('/npm-answers', async (req, res) => {
  try {
    const questions = await Post.find().where({ tags: { $in: ['npm'] } });
    const answers = await Post.find().where({
      parentID: { $in: questions.map(q => q.soID) },
    });
    return res.json(answers);
  } catch (error) {
    return handleError(res, STATUS_USER_ERROR, 'Something went wrong');
  }
});

module.exports = { server };
