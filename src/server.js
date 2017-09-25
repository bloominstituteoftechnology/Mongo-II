const bodyParser = require('body-parser');
const express = require('express');

const Post = require('./post.js');

const STATUS_USER_ERROR = 422;

// const sendUserError = (err, res) => {
//   res.status(STATUS_USER_ERROR);
//   if (err === 'string') {
//     res.json({ error: err });
//   } else {
//     res.json(err);
//   }
// };

const server = express();
// to enable parsing of json bodies for post requests


server.use(bodyParser.json());

// TODO: write your route handlers here

server.get('/accepted-answer/:soID', (req, res) => {
    Post.findOne({ soID: req.params.soID }, (err, question) => {
      if (err) {
        res.send(STATUS_USER_ERROR);
        res.json(err);
        return;
      }
      if (!question) {
        res.status(STATUS_USER_ERROR);
        res.json({ error: "Couldnt locate" });
        return;
      }
      Post.findOne({ soID: question.acceptedAnswerId }, (err2, answer) => {
        if (err2) {
          res.send(STATUS_USER_ERROR);
          res.json(err2);
          return;
        }
        if (!answer) {
          res.status(STATUS_USER_ERROR);
          res.json({ error: "Couldnt locate" });
          return;
        }
        res.json(answer);
      });
    });
  });
  
  
  server.get('/topanswer/:soID', (res, req) => {
    Post.findOne({ soID: req.params.soID }, (err, question) => {
      if (err) {
        res.send(STATUS_USER_ERROR);
        res.json(err);
        return;
      }
      if (!question) {
        res.status(STATUS_USER_ERROR);
        res.json({ error: "Couldnt locate" });
        return;
      }
      Post.findOne({
        soID: { $ne: question.acceptedAnswerId },
        parentID: question.soID
      })
          .sort({ score: 'desc' })
          .exec((err2, answer) => {
            if (err2) {
              res.send(STATUS_USER_ERROR);
              res.json(err2);
              return;
            }
            if (!answer) {
              res.status(STATUS_USER_ERROR);
              res.json({ error: "Couldnt locate" });
              return;
            }
            res.json(answer);
          });
    });
  });
  
  
  server.get('/popular-jquery-questions', (res, req) => {
    Post.find({
      parentID: null,
      tags: 'query',
      $or: [
          { score: { $gt: 5000, } },
          { 'user.reputation': { $gt: 200000 } }
      ]
    }).then((err2, posts) => {
      if (err2) {
          res.send(STATUS_USER_ERROR);
          res.json(err2);
          return;
        }
        if (!answer) {
          res.status(STATUS_USER_ERROR);
          res.json({ error: "Couldnt locate" });
          return;
        }
        res.json(posts);
  });

  server.get('/npm-answers', (res, req) => {
    Post.find({parentID: null,tags: 'npm' })
        .then((err, questions) => {
            if (err) {
                res.send(STATUS_USER_ERROR);
                res.json(err2);
                return;
              }
              if (!questions) {
                res.status(STATUS_USER_ERROR);
                res.json({ error: "Couldnt locate" });
                return;
              }
              if (questions.length === 0) {
                  res.statusCode(STATUS_USER_ERROR); 
                  res.json({ error: "No question tag with npm could not be found" });
                  return;
              }

              const questionID = questions.map(q => q.soID);
              Post.find({ parentID: { $in: questionIDs } } .then((err2, posts) => {
                if (err2) {
                    res.send(STATUS_USER_ERROR);
                    res.json(err2);
                    return;
                  }
                  if (!answer) {
                    res.status(STATUS_USER_ERROR);
                    res.json({ error: "Couldnt locate" });
                    return;
                  };
        }));
  });

module.exports = { server };