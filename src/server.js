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
          catchLog(`soID not found: ${err}`);
          res.status(statusCodes.userError).json(`soID not found: ${err}`);
        });
});
server.get('/top-answer/:soID', (req, res)

module.exports = { server };
