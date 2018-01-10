const bodyParser = require('body-parser');
const express = require('express');
const Post = require('./post.js');
const PostController = require('./PostController');

const STATUS_USER_ERROR = 422;

const server = express();
// to enable parsing of json bodies for post requests

server.use(bodyParser.json());

// TODO: write your route handlers here
server.get('/accepted-answer/:soID', PostController.getAcceptedAnswer);
server.get('/top-answer/:soID', PostController.getTopAnswer);
server.get('/popular-jquery-questions', PostController.getPopularjQueryQuestions);
server.get('/npm-answers', PostController.getNpmAnswers);
module.exports = { server };
