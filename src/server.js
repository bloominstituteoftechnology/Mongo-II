const bodyParser = require('body-parser');
const express = require('express');

const Post = require('./post.js');

const STATUS_USER_ERROR = 422;

const server = express();
// to enable parsing of json bodies for post requests

server.use(bodyParser.json());
// write a helper function to offload the work for errorhandling
// err, objectQueried, res

const myErrorHandler = (err, res) => {
    res.status(STATUS_USER_ERROR);
    if (typeof err === 'string') {
        res.json({ error: err });
    } else {
        res.json(err);
    }
};
// TODO: write your route handlers here
server.get('/accepted-answer/:soID', (req, res) => {
  const { soID } = req.params;
  Post.findOne({ soID }, (err1, foundPost) => {
    if (err1 || foundPost === null) {
      res.status(STATUS_USER_ERROR).json(err1);
      return;
    }
    Post.findOne({ soID: foundPost.acceptedAnswerID },
        (err2, acceptedAnswer) => {
          if (err2 || acceptedAnswer === null) {
            res.status(STATUS_USER_ERROR).json(err2);
            return;
          }
          res.json(acceptedAnswer);
        },
    );
  }
);
});

server.get('/top-answer/:soID', (req, res) => {
    const { soID } = req.params;
    Post.findOne({ soID }, (err, post) => {
        if (err || post === null) {
            res.status(STATUS_USER_ERROR).json(err);
            return;
        }
        Post.findOne({ soID: { $ne: post.acceptedAnswerID }, parentID: soID }).sort(
            { score: 'desc' },
        )
        .exec((err2, sortedAnswer) => {
            if (err2 || sortedAnswer === null) {
                res.status(STATUS_USER_ERROR).json(err2);
                return;
            }  
            res.json(sortedAnswer);
        });
        //res.json(post);
        //post.soID ---> parentID post.acceptedAnswerID ---> $ne soID
        //sort score by desc
    });
});

server.get('/popular-jquery-questions', (req, res) => {
    Post.find({
        parentID: null,
        tags: 'jquery',
        $or: [{score: {$gt: 5000}}, { 'user.reputation': { $gt: 200000} }],
    }).exec((err, posts) => {
        if(err || posts.length === 0) {
            myErrorHandler(err, res);
            return;
        }
        res.json(posts);
    });
});

server.get('/npm-answers', (req, res) => {
    Post.find({
      tags: 'npm'  
    })
    .exec((err, questions) => {
        if (err || questions.length === 0) {
            myErrorHandler(err, res);
            return;
        }
        //res.json(questions);
        // write my 2nd query
        Post.find({
            parentID: { $in: questions.map(q => q.soID) },
        }).exec((err1, answers) => {
            if (err1 || answers.length === 0) {
                myErrorHandler(err1, res);
                return;
            }
            res.json(answers);
        });
    });
});

module.exports = { server };
