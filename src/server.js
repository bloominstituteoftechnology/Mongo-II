const bodyParser = require('body-parser');
const express = require('express');

const Post = require('./post.js');

const STATUS_USER_ERROR = 422;

const server = express();

server.use(bodyParser.json());

server.get('/accepted-answer/:soID', (req, res) => {
  const soID = parseInt(req.params.soID, 10);
  if (!soID) res.status(422).json({ error: 'provide a valid stack overflow ID' });

  Post.findOne({ soID })
    .then((questionDoc) => {
      Post.findOne({ soID: questionDoc.acceptedAnswerID })
        .then(answerDoc => {
          if (answerDoc !== null) res.json(answerDoc);
          else res.status(422).json({ error: 'no accepted answer' });
        })
        .catch(err => res.status(422).json({ error: err }));
    })
    .catch(err => res.status(422).json({ error: err }));
});

server.get('/top-answer/:soID', (req, res) => {
  const soID = parseInt(req.params.soID, 10);
  if (!soID) res.status(422).json({ errror: 'provide a valid stack overflow ID' });

  Post.findOne({ soID })
    .then((questionDoc) => {
      Post.findOne()
        .where({ parentID: soID })
        .where({ soID: { $ne: questionDoc.acceptedAnswerID } })
        .sort('-score')
        .limit(1)
        .then((answerDoc) => {
          if (answerDoc.length !== 0) res.json(answerDoc);
          else res.status(422).json({ error: 'no top answer'});
        })
        .catch(err => res.status(422).json({ error: err }));
    })
    .catch(err => res.status(422).json({ error: err }));
});

server.get('/popular-jquery-questions', (req, res) => {
  Post.find()
    .where('tags').in(['jquery'])
    .or([{ score: { $gt: 5000 } }, { 'user.reputation': { $gt: 200000 } }])
    .then(doc => res.json(doc))
    .catch(err => res.status(422).json({ error: err }));
});

server.get('/npm-answers', (req, res) => {
  Post.find({})
    .where('tags').in(['npm'])
    .then((docs) => {
      // get the array of all the soIDs with npm tags?
      const npmSoIDArr = docs.map(doc => doc.soID);
      Post.find({})
        .where('parentID').in(npmSoIDArr)
        .then(doc => res.json(doc))
        .catch(err => res.status(422).json({ error: err }));
    })
    .catch(err => res.status(422).json({ error: err }));
});

module.exports = { server };
