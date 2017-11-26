const bodyParser = require('body-parser');
const express = require('express');

const Post = require('./post.js');

const statusCodes = require('../util/statusCodes.js');
const { log, catchLog } = require('../util/console.js');

const STATUS_USER_ERROR = 422;

const server = express();
// to enable parsing of json bodies for post requests

server.use(bodyParser.json());

// TODO: write your route handlers here
server.get('/accepted-answer/:soID', (req, res) => {
  const soID = req.params.soID;
  Post.findOne()
        .where('soID').equals(soID)
        .select('acceptedAnswerID')
        .exec()
        .then((ids, err) => {
          if (err) {
            log(`soId: ${soID}  not found`);
            throw err;
          }
          log(`soId: ${soID} ids: ${ids}`);
          if (!ids || ids.acceptedAnswerID === null) {
            log(`soId: ${soID}  no accepted answer`);
            throw new Error('Accepted Answer is null');
          }
          Post.findOne()
          .where('soID').equals(ids.acceptedAnswerID)
          .exec()
          .then((post, aerr) => {
            if (aerr) {
              log(`soId: ${soID} accepted answer soID ${ids.acceptedAnswerID} find failed`);
              throw aerr;
            }
            log(`soId: ${soID} accepted answer soID: ${post ? post.soID : 'null'}`);
            res.json(post);
          })
          .catch((uerr) => {
            catchLog(`answer not found: ${uerr}`);
            res.status(statusCodes.userError).json(`answer not found: ${uerr}`);
          });
        })
        .catch((err) => {
          catchLog(`soID ${soID} not found: ${err}`);
          res.status(statusCodes.userError).json(`soID not found: ${err}`);
        });
});
server.get('/top-answer/:soID', (req, res) => {
  const soID = req.params.soID;
  Post.findOne()
          .where('soID').equals(soID)
          .select('acceptedAnswerID')
          .exec()
          .then((ids, err) => {
            if (err) {
              throw (err);
            }
            if (!ids) {
              throw new Error(`soID ${soID} not found`);
            }
            const aid = ids.acceptedAnswerID == null ? -1 : ids.acceptedAnswerID;
            Post.find()
            .where('parentID').equals(soID)
            .where('soID')
            .ne(aid)
            .sort({ score: 'desc' })
            .exec()
            .then((posts, perr) => {
              if (perr) {
                throw perr;
              }
              if (!posts || posts.length === 0) {
                throw new Error(`soID ${soID} no answers found`);
              }
              res.json(posts[0]);
            })
            .catch((uerr) => {
              catchLog(`soID ${soID} answer not found: ${uerr}`);
              res.status(statusCodes.userError).json(`answer not found: ${uerr}`);
            });
          })
          .catch((err) => {
            catchLog(`soID ${soID} not found: ${err}`);
            res.status(statusCodes.userError).json(`soID not found: ${err}`);
          });
});
server.get('/popular-jquery-questions', (req, res) => {
  Post.find()
  .where({ tags: { $elemMatch: { $eq: 'jquery' } } })
  .where({ $or: [{ score: { $gt: 5000 } }, { 'user.reputation': { $gt: 200000 } }] })
  .where('parentID')
  .equals(null)
  .exec()
  .then((posts, err) => {
    if (err) {
      throw err;
    }
    if (!posts || posts.length === 0) {
      throw new Error('no jquery questions found');
    }
    res.json(posts);
  })
  .catch((err) => {
    res.status(statusCodes.serverError).json('failed to get jquery questions');
  });
});

server.get('/npm-answers', (req, res) => {
  Post.find()
    .where({ tags: { $elemMatch: { $eq: 'npm' } } })
    .where('parentID')
    .equals(null)
    .select('soID -_id')
    .exec()
    .then((posts, err) => {
      if (err) {
        throw err;
      }
      if (!posts || posts.length === 0) {
        throw new Error('no npm questions found');
      }
      Post.find()
        .where('parentID')
        .in(
            posts.map(post => post.soID)
        )
        .exec()
        .then((aposts, aerr) => {
          if (aerr) {
            throw err;
          }
          if (!aposts || aposts.length === 0) {
            throw new Error('no npm answers found');
          }
          res.json(aposts);
        })
        .catch((uerr) => {
          catchLog(`npm answers not found: ${uerr}`);
          res.status(statusCodes.userError).json(`npm answers not found: ${uerr}`);
        });
    })
    .catch((err) => {
      catchLog(`npm questions not found: ${err}`);
      res.status(statusCodes.userError).json(`no npm questions found: ${err}`);
    });
});

module.exports = { server };
