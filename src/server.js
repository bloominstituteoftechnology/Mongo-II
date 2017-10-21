const bodyParser = require('body-parser');
const express = require('express');

const Post = require('./post.js');

const STATUS_USER_ERROR = 422;
const STATUS_SERVER_ERROR = 500;

const server = express();
// to enable parsing of json bodies for post requests

server.use(bodyParser.json());

// GET /accepted-answer/:soID
server.get('/accepted-answer/:soID', (req, res) => {
  if (!req.params.soID || req.params.soID === null) {
    return res.status(STATUS_USER_ERROR).json({ error: 'Invalid numeric soID' });
  }

  Post.findOne({ soID: req.params.soID }).then((post) => {
    if (post === null) return res.status(STATUS_USER_ERROR).json({ error: 'Question did not exist' });

    if (post.acceptedAnswerID === null) {
      return res.status(STATUS_USER_ERROR).json({ error: 'Question did not have an accepted answer.' });
    }

    Post.findOne({ soID: post.acceptedAnswerID }).then((ans) => {
      return res.json(ans);
    }).catch((err) => {
      res.json({ error: err });
    });
  }).catch((err) => {
    return res.status(STATUS_USER_ERROR).json({ error: 'bad id' });
  });
});

server.get('/top-answer/:soID', (req, res) => {
  // Validity check of request params
  if (!req.params.soID || req.params.soID === null) {
    return res.status(STATUS_USER_ERROR).json({ error: 'Invalid numeric soID' });
  }
  // Find Original post to get
  Post.findOne({ soID: req.params.soID }).select('acceptedAnswerID').then((question) => {
    // Check if question exists
    if (question === null) return res.status(STATUS_USER_ERROR).json({ error: 'Question does not exist' });
    // find the list of posts
    Post.find({ parentID: req.params.soID })
    // Remove the accpeted answer from the list
    .where('soID').ne(question.acceptedAnswerID)
    // Sort by highest first
    .sort({ score: -1 })
    // Work with the results
    .then((posts) => {
      // If the length is zero, that means that there was only an accepted answer or no answers at all.
      // Return an error
      if (posts.length === 0) return res.status(STATUS_USER_ERROR).json({ error: 'There are no answers for that question.' });
      // return the first answer then.
      res.json(posts[0]);
    })
    .catch((err) => {
      // this...
      console.log(err);
      return res.status(STATUS_USER_ERROR).json({ error: 'bad id' });
    });
  }).catch((err) => {
    res.status(STATUS_USER_ERROR).json({ error: 'Question does not exist' });
  });
});


server.get('^\/popular-[a-zA-Z0-9-]*-questions$', (req, res) => {
  // Get tags from route
  const tags = req.path.slice(1).split('-').slice(1, -1);
  console.log(tags);
  // get list of questions
  Post.find({ tags: { $in: tags }, soID: { $ne: null } })
  .sort({ score: -1 })
  .limit(3)
  .then((data) => {
    res.json(data);
  })
  .catch((err) => {
    res.status(STATUS_USER_ERROR).json({ error: err });
  });
});

server.get('^\/[a-zA-Z0-9-]*-answers$', (req, res) => {
  // Get tags from route
  const tags = req.path.slice(1).split('-').slice(0, -1);
  // Are tags?
  if (tags.length === 0) res.status(STATUS_USER_ERROR).json({ error: 'No acceptable tags.' });
  // Find all Questions that have answers with the tags
  // Post.find({ acceptedAnswerID: { $ne: null }, tags: { $in: tags } }).select('acceptedAnswerID').then((data) => {
  Post.find({ tags: { $in: tags } }).select('soID').then((data) => {
    // Map all questions to a Promise.all to get all the results.... wait no.  Get the values and search for those. yea.
    Post.find({ parentID: { $in: data.map(ans => ans.soID) } }).then((answers) => {
      // If no answers found
      if (answers.length === 0) return res.status(STATUS_USER_ERROR).json({ error: 'No answers for supplied tag(s)' });
      // Return answers
      res.json(answers);
    }).catch((err) => {
      // There was an error in finding the tagged answers
      res.status(STATUS_SERVER_ERROR).json({ error: err });
    });
  }).catch((err) => {
    // There was an error in finding questions with the tag(s)
    res.status(STATUS_SERVER_ERROR).json({ error: err });
  });
});

module.exports = { server };
