const bodyParser = require('body-parser');
const express = require('express');

const Post = require('./post.js');

const STATUS_USER_ERROR = 422;

const server = express();
// to enable parsing of json bodies for post requests

server.use(bodyParser.json());

server.get('/posts/:soID', (req, res) => {
  const { soID } = req.params;
  Post.find({ soID }, (err, posts) => {
    if (err) return res.status(STATUS_USER_ERROR).json({ error: 'no posts found' });
    res.json(posts);
  });
});

server.get('/accepted-answer/:soID', (req, res) => {
  const { soID } = req.params;
  if (!Number(soID)) return res.status(STATUS_USER_ERROR).json({ error: 'parametr must be number' });
  Post.findOne({ soID }, (err, post) => {
    if (err) return res.status(STATUS_USER_ERROR).json({ error: 'no post found by this ID' });
    Post.findOne({ soID: post.acceptedAnswerID }, (error, answer) => {
      if (!answer) return res.status(STATUS_USER_ERROR).json({ error: 'no answer found for this post' });
      res.json(answer);
    });
    return;
  });
});

server.get('/top-answer/:soID', (req, res) => {
  const { soID } = req.params;
  Post.findOne({ soID }, (err, post) => {
    if (err) return res.status(STATUS_USER_ERROR).json({ error: 'no post found by this ID' });
    Post.find({ parentID: soID }, (error, ans) => {
      if (err) return res.status(STATUS_USER_ERROR).json({ error: 'no answers found' });
      if (!ans.length) return res.status(STATUS_USER_ERROR).json({ error: 'no answers found' });
      let count = 0;
      let answer;
      for (let i = 0; i < ans.length; i++) {
        if (count < ans[i].score && ans[i].soID !== post.acceptedAnswerID) {
          count = ans[i].score;
          answer = ans[i];
        }
      }
      res.json(answer);
    });
  });
});

server.get('/popular-jquery-questions', (req, res) => {
  Post.find({
    $or: [
      { $and: [
              { tags: { $in: ['jquery'] } },
              { score: { $gt: 5000 } }
      ] },
      { $and: [
              { tags: { $in: ['jquery'] } },
              { user: { $exists: true } },
              { 'user.reputation': { $gt: 200000 } }
      ] }
    ]
  }, (err, result) => {
    if (err) return res.status(STATUS_USER_ERROR).json({ error: 'no posts in this range' });
    res.json(result);
  });
});

server.get('/npm-answers', (req, res) => {
  Post.find({ tags: { $in: ['npm'] } }, (err, questions) => {
    if (err) return res.status(STATUS_USER_ERROR).json({ error: 'no posts in this range' });
    const soIDs = questions.map(x => x.soID);
    let result;
    Post.find({ parentID: soIDs.map(x => x) }, (error, docs) => {
      if (err) return res.status(STATUS_USER_ERROR).json({ error: 'no answers found' });
      res.json(docs);
    });
  });
});

module.exports = { server };
