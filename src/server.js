const bodyParser = require('body-parser');
const express = require('express');
const Post = require('./post.js');

const STATUS_USER_ERROR = 422;
const STATUS_SERVER_ERROR = 500;

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());

// TODO: write your route handlers here
server.get('/posts', (req, res) => {
  Post.find({}, (err, results) => {
    if (err) {
      throw err;
    }
    res.json(results);
  });
});

server.get('/accepted-answer/:soID', (req, res) => {
  const id = req.params.soID;
  Post.findOne({ soID: id })
    .exec((err, answer) => {
      if (err) {
        res.status(STATUS_USER_ERROR);
        res.json(err);
        return;
      }
      Post.findOne({ soID: answer.acceptedAnswerID })
        .exec((error, ans) => {
          if (error) {
            res.status(STATUS_SERVER_ERROR);
            res.json(error);
            return;
          } else if (!ans) {
            res.status(STATUS_USER_ERROR);
            res.json(error);
            return;
          }
          res.json(ans);
        });
    });
});

// server.get('/accepted-answer/:soID', (req, res) => {
//   const { soID } = req.params;
//   Post.findOne({ soID })
//     .exec((err, post) => {
//       if (!post) {
//         sendUserError(err, res);
//         return;
//       }
//       Post.findOne({ soID: post.acceptedAnswerID })
//         .exec((error, answer) => {
//           if (!answer) {
//             sendUserError(error, res);
//             return;
//           }
//           res.json(answer);
//         });
//     });
// });

module.exports = { server };
