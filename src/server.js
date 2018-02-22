const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Post = require('./post.js');

const STATUS_USER_ERROR = 422;

const server = express();
// to enable parsing of json bodies for post requests

server.use(bodyParser.json());

// write a helper function to offload the work for error handling
// err that we're concerned with, object queried, result
const myErrorHandler = (err, res) => { // create a method of handling the following lines of code
  res.status(STATUS_USER_ERROR); // the resulting status is STATUS_USER_ERROR
  if (typeof err === 'string') { // if the error given is a string -> ie you type in a specific error string
    res.json({error: err}); // return that string
  } else { // otherwise
    res.json(err); // return whatever error is parsed out by mongo/mongoose
  }
};

// TODO: write your route handlers here

server.get('/accepted-answer/:soID', (req, res) => {
  const { soID } = req.params; // gimmie the soID so I can use it
  Post.findOne({ soID }, (err1, foundPost) => { // find the first instance of the soID
    if(err1 || foundPost === null) { // if errors out or there are no posts
      myErrorHandler(err1, res); // implement the errorHandler
      return; // break
    }
    Post.findOne({ soID: foundPost.acceptedAnswerID }, (err2, acceptedAnswer) => { // else find the first instance of the soID matching the acceptedAnswerID
      if(err2 || !acceptedAnswer) { // if the second query errors out or there are no accepted answers
        myErrorHandler(err2, res); // implement the error handler
        return; // break
      }
      res.json(acceptedAnswer); // otherwise return the acceptedAnswer
    })
  });
});

server.get('/top-answer/:soID', (req, res) => {
  const { soID } = req.params; // pull out the soID so I can use it
  Post.findOne({soID}, (err, post) => { // find the first instance where the soID is a match
    if (!post) { // if there's no post
      myErrorHandler('There is no post found by that soID', res); // the result is the error passed by mongoose
      return;
    }
    // post.soID ---> parentID    the post's soID matches the parentID
    // post.acceptedAnswerID ---> != soID
    // sort by descending score
    Post.findOne({ soID: { $ne: post.acceptedAnswerID }, parentID: soID }) // find the first instance where the parent ID matches the soID, but the soID doesNOT equal the acceptedAnswerID
      .sort({ score: -1 }) // sort descending
      .exec((err2, sortedAnswers) => { // execute
        if(!sortedAnswers) { // if no sortedAnswers
          myErrorHandler('Nuffink der', res); // implement the error handler
          return; // break
        }
        res.json(sortedAnswers); // otherwise return the sortedAnswers
      });
  });
});

server.get('/popular-jquery-questions', (req, res) => {
  // where tags include 'jquery'
  // where score > 5000 OR user.reputation > 200,000
  Post.find({ // find all posts whose:
    parentID: null, // parentID is null -> indicating a question
    tags: 'jquery', // tags include jquery
    $or: [{score: {$gt: 5000}}, {'user.reputation': {$gt: 200000}}], // either the score is > 5000 or the user rep is > 200k
  }).exec((err, posts) => { // execute 
    if (err || posts.length === 0) { // if there's an error or there are no posts matching
      myErrorHandler('jquery is not popular enough to return any answers', res); // the result is an error code
      return; 
    }
    res.json(posts); // gimmie da posts
  });
});

server.get('/npm-answers', (req, res) => {
  Post.find({ // find all posts whose:
    tags: 'npm', // tags include npm
    parentID: null, // whose parentID is null -> giving only questions - a double check with the tags to filter out answers
  },
  (err, questions) => { // callback the error handler or the questions
    if (err || questions.length === 0) { // if an error or there are no questions that match
      myErrorHandler(err, res); // implement the errorHandler
      return; // break
    }
    // second query here
    Post.find({ // otherwise find
      parentID: {$in: questions.map(q => q.soID)}, // posts whose parentID are found within an array of the questions returned above
    })
    .exec((err1, answers) => { // push the execute down here so we don't exit prematurely - give me the error message or the answers
      if (err1 || answers.length ===0) { // error out or no answers matching the above questions
        myErrorHandler(err1, res); // implement error handler
        return; // break
      }
      res.json(answers); // else return the answers to the nested query
    });
    // loop over array of questions
    // match where parentID === soID
  },
  );
});

module.exports = { server };
