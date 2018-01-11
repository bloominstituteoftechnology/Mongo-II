const bodyParser = require('body-parser');
const express = require('express');

const Post = require('./post.js');

const STATUS_USER_ERROR = 422;

const server = express();
// to enable parsing of json bodies for post requests

server.use(bodyParser.json());

// TODO: write your route handlers here
server.get('/posts/', (req, res) => {
  Post.find()
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((error) => {
      res.status(500)
        .json({ message: 'Server Error', error });
    });
});

server.get('/accepted-answer/:soID', (req, res) => {
  const id = req.params.soID;

  Post.findOne({ soID: id })
    .then((post) => {
    	const ansID = post.acceptedAnswerID;
    	Post.findOne({ soID: ansID })
    	  .then((post) => {
            if (post !== null) {
              res.status(200).json(post);
            } else {
              res.status(404).json({ message: 'Answered not found' });
            }
    	  })
    	  .catch((error) => {
            if (error.name === 'CastError') {
              res.status(500).json({ message: 'The ID provided is invalid', error });
            } else {
              res.status(500).json({ message: 'Server Error', error });
            }
    	  });  
    });
});

server.get('/top-answer/:soID', (req, res) => {
  const id = req.params.soID;

  Post.findOne({ soID: id })
    .then((post) => {
      const questionParentID = post.parentID;
      const acceptedAnsID = post.acceptedAnswerID;
      Post.find({ parentID: id }).sort({ score: 'descending'})
        .then((posts) => {
          const topID = posts[0].soID;
          if (questionParentID === null && topID !== acceptedAnsID) {
          	res.status(200).json(posts[0]);
          } else if (questionParentID === null && topID === acceptedAnsID) {
          	res.status(404).json({ message: 'Top Score Answer is the Accepted Answer!' });
    	  }	   
        });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(500).json({ message: 'The ID provided is invalid', error });
      } else {
        res.status(500).json({ message: 'Server Error', error });
      }
    }); 
});

server.get('/popular-jquery-questions', (req, res) => {
  Post.find({ tags: 'jquery'})
    .then((posts) => {
    	const results = posts.filter((post) => post.score > 5000 || post.user.reputation > 200000);
    	res.status(200).json(results);
    })
    .catch((error) => {
    	res.status(500).json({ message: 'None post qualified!', error });
    });
});

server.get('/npm-answers', (req, res) => {
  Post.find({ parentID: null, tags: 'npm'})
    .then((posts) => {
    	const soIDArr = posts.map((p) => p.soID);
        Post.find({ tags: []})
          .then((posts) => {
          	const results = posts.filter((p) => soIDArr.includes(p.parentID));
          	res.status(200).json(results);
          })
          .catch((error) => {
          	res.status(500).json({ message: 'None found!', error });
          });
    })
    .catch((error) => {
    	res.status(500).json({ message: 'None post about NPM found!', error });
    });
});
module.exports = { server };
