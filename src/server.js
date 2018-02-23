const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');

const Post = require('./post.js');

const STATUS_USER_ERROR = 422;

const server = express();
// to enable parsing of json bodies for post requests

server.use(bodyParser.json());

// TODO: write your route handlers here

server.get('/accepted-answer/:soID', (req, res) => {
  const { soID } = req.params;

  Post.findOne({ soID })
    .then(post => {
      const id = post.acceptedAnswerID;
      Post.findOne({soID: id})
        .then(answerPost => {
          if(answerPost) {
            res.status(200).json(answerPost);
          } else {
            res.status(404).json(`Not found by this id`);
          }
        })
        .catch(error => {
          res.status(500).json({errorMessage: 'Can not access server for answer post.'});
        })
    })
    .catch(error => {
      res.status(500).json({errorMessage: 'Can not access server for question post.'});
    })
});

server.get('/top-answer/:soID', (req, res) => {
	const { soID } = req.params;
	Post.findOne({soID})
	.then(question => {
		console.log('question', question);
		if (question) {
			const id = question.acceptedAnswerID;
			Post.find({ parentID: soID })
				.sort('-score')
				.then((topAnswers) => {
					if (topAnswers[0].soID !== id) {
						res.status(200).json(topAnswers[0]);
					} else {
						res.status(200).json(topAnswers[1]);
					}
				})
				.catch(err => {
					res.status(500).json({ errorMessage: 'Can not access server for topAnswers' });
				})
		}else {
			res.status(404).json({ errorMessage: 'Question post not found by that id' });
		}
	})
	.catch(err => {
		res.status(500).json({ errorMessage: 'Can not access server for questions' });
	});
});

server.get('/popular-jquery-questions', (req, res) => {
  Post.find({ parentID: null, tags: 'jquery'})
  .or([{score: {$gt: 5000} }, {'user.reputation': {$gt: 200000}}])
  .then(questions => {
    if (questions) {
      res.status(200).json(questions);
    } else {
      res.status(404).json({errorMessage: 'Questions not found by popular query'});
    }
  })
  .catch(error => {
    res.status(500).json({errorMessage: 'Server error getting questions'});
  });
});

module.exports = { server };
