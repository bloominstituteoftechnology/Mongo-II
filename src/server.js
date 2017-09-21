const bodyParser = require('body-parser');
const express = require('express');
const Post = require('./post');
const async = require('async');

const STATUS_USER_ERROR = 422;

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());

const processErr = (status, message, res) => {
  res.status(status).send({ err: message });
  return;
};

const getPostBysoID = ({ soID }) => {
  return new Promise((resolve, reject) => {
    if (soID.length < 5) {
      reject({ status: 422, message: 'Please enter a correct ID' });
    } else {
      Post.findOne({ soID }).exec((err, question) => {
        if (err || !question) {
          reject({ status: 500, message: 'Server error finding the question.' });
        } else {
          resolve(question);
        }
      });
    }
  });
};

// TODO: write your route handlers here
server.get('/accepted-answer/:soID', (req, res) => {
  const { soID } = req.params;
  getPostBysoID({ soID })
    .then((question) => {
      Post.findOne({ soID: question.acceptedAnswerID })
        .exec((err, answer) => {
          if (err) {
            return processErr(500, 'Server error locating answer.', res);
          }
          return answer ? res.json(answer) : processErr(422, 'That answer is not in db.', res);
        });
    })
    .catch(err => processErr(err.status, err.message, res));
});

server.get('/top-answer/:soID', (req, res) => {
  const { soID } = req.params;
  getPostBysoID({ soID })
    .then((question) => {
      Post.findOne({ parentID: question.soID, soID: { $ne: question.acceptedAnswerID } })
        .sort({ score: 'desc' })
        .exec((err, answer) => {
          if (err) {
            return processErr(500, 'Server error locating answer', res);
          }
          return answer ? res.json(answer) : processErr(422, 'That answer is not in db.', res);
        });
    })
    .catch(err => processErr(err.status, err.message, res));
});

server.get('/popular-jquery-questions', (req, res) => {
  Post.find({ tags: { $in: ['jquery'] }, $or: [{ score: { $gt: 5000 } }, { 'user.reputation': { $gt: 200000 } }] })
    .exec((err, questions) => {
      if (err) return processErr(500, 'Server error locating questions.', res);
      return questions ? res.json(questions) : processErr(422, 'Questions not found.');
    });
});

server.get('/npm-answers', (req, res) => {
  const getPost = (done) => {
    Post.find({ tags: { $in: ['npm'] } })
      .exec((err, questions) => {
        if (err) {
          done({ status: 500, message: 'Server error looking up npm questions.' });
        } else {
          const qIds = questions.map(q => q.soID);
          done(null, qIds);
        }
      });
  };
  const getAnswers = (qIds, done) => {
    Post.find({ parentID: { $in: qIds } })
      .exec((err, answers) => {
        if (err) {
          done({ status: 500, message: 'Error retrieving answers for npm questions.' });
        } else {
          done(null, answers, qIds);
        }
      });
  };
  async.waterfall([
    getPost,
    getAnswers
  ], (err, answers, qIds) => {
    if (err) return processErr(err.status, err.message, res);
    return answers ? res.json(answers) : processErr(422, 'Could not get these npm answers.', res);
  });
});

module.exports = { server };
