const bodyParser = require('body-parser');
const express = require('express');
const Post = require('./post');

const STATUS_USER_ERROR = 422;

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());

// TODO: write your route handlers here

const sendUserError = (err, res) => {
  res.status(STATUS_USER_ERROR);
  if (err === 'string') {
    res.json({ error: err });
  } else {
    res.json(err);
  }
};

server.get('/', (req, res) => {
  Post.find({}, (error, data) => {
    if (error) {
      res.status(500);
      res.json({ error });
    } else {
      res.json(data);
    }
  });
});

// server.get('/accepted-answer/:soID', (req, res) => {
//   const { soID } = req.params;
//   const acceptedAnswerID = 0;
//   Post.find({ soID }, (error, data) => {
//     if (error) {
//       res.status(500);
//       res.json({ error });
//     }
//   });
//   console.log(acceptedAnswerID);
//   Post.find({ soID: acceptedAnswerID }, (error, data) => {
//     if (error) {
//       res.status(500);
//       res.json({ error });
//     }
//     res.json({ data });
//   });
// });

server.get('/accepted-answer/:soID', (req, res) => {
  const { soID } = req.params;
  Post.findOne({ soID })
    .exec((err, post) => {
      if (!post) {
        sendUserError(err, res);
        return;
      }
      Post.findOne({ soID: post.acceptedAnswerID })
        .exec((error, answer) => {
          if (!answer) {
            sendUserError(error, res);
            return;
          }
          res.json(answer);
        });
    });
});

server.get('/top-answer/:soID', (req, res) => {
  const { soID } = req.params;
  Post.findOne({ soID })
  .exec((error, post) => {
    if (!post) {
      sendUserError(error, res);
      return;
    }
    Post.find({ parentID: soID }, { soID: { $ne: post.acceptedAnswerID } })
    .sort({ score: -1 })
    .limit(1)
    .exec((err, answer) => {
      if (!answer) {
        sendUserError(err, res);
        return;
      }
      res.json(answer);
    });
  });
});

server.get('/popular-jquery-questions', (req, res) => {
  Post.find({ $and: [{ tags: 'jquery' }, { $or: [{ score: { $gt: 5000 } }, { 'user.reputation': { $gt: 200000 } }] }] })
  .exec((error, questions) => {
    if (!questions) {
      sendUserError(error, res);
      return;
    }
    res.json(questions);
  });
});

server.get('/npm-answers', (req, res) => {
  const idArr = [];
  Post.find({ tags: 'npm' }, { soID: 1, _id: 0 })
  .exec((err, questions) => {
    if (!questions) {
      sendUserError(err, res);
      return;
    }
    console.log(questions);
    // for loop over the array to make a new array of just the ids
    // then you can do post.find(for(loop over array for IDs) do `or` operation)
    Post.find({ parentID: { $or: questions } })
    .exec((error, answers) => {
      if (!answers) {
        sendUserError(error, res);
        return;
      }
      res.json(answers);
    });
  });
});

module.exports = { server };
