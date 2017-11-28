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
  if (isNaN(soID)) res.status(422).json('bad ID');
  // console.log(soID);
  Post.findOne({ soID })
    .select('acceptedAnswerID')
    .exec((err1, post) => {
      // console.log('>>>>>>>>>>>>>>>>> err1', err1, post);
      if (err1 || post === null) {
        res.status(STATUS_USER_ERROR);
        return;
      }

      if (!post.acceptedAnswerID) res.status(422).json('no accepted answer');

      Post.findOne({ soID: post.acceptedAnswerID }, (err2, answer) => {
        // console.log('>>>>>>>>>>>>> err2', err2, answer);
        if (err2 || answer === null) {
          res.status(STATUS_USER_ERROR);
          return;
        }
        res.status(200).json(answer);
      });
    });
});

server.get('/top-answer/:soID', (req, res) => {
  const { soID } = req.params;
  Post.findOne({ soID })
    .select('acceptedAnswerID')
    .exec((err1, answerId) => {
      if (err1 || !answerId) res.status(STATUS_USER_ERROR);
      else return answerId;
    })
    .then((value) => {
      Post.find({ parentID: soID })
        .sort({ score: -1 })
        .exec((err, posts) => {
          if (err) res.status(STATUS_USER_ERROR);
          console.log('>>>>>>>>>>>>>', posts[0].score, value);
          for (let i = 0; i < posts.length; i++) {
            // if (posts[i].score === '5747') console.log(posts[i].soID, value);
            if (posts[i].soID !== value.acceptedAnswerID) res.json(posts[i]);
          }
        });
    });
  // Post.find({ parentID: soID })
  //   .sort({ score: -1 })
  //   .exec((err, posts) => {
  //     if (err) res.status(STATUS_USER_ERROR);

  //     for (let i = 0; i < scores.length; i++) {
  //       if posts[i].acceptedAnswerID
  //     }

  //   })
  //   .then((scores) => {
  //     for (let i = 0; i < scores.length; i++) {

  //     }
  //     res.json(scores[0]);
  //   });
});
server.get('/popular-jquery-questions', (req, res) => {
  Post.find({ $and: [{ tags: { $in: ['jquery'] } }] });
});
module.exports = { server };
