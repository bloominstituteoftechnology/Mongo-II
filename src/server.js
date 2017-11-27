const bodyParser = require('body-parser');
const express = require('express');

const Post = require('./post.js');

const STATUS_USER_ERROR = 422;

const server = express();
// to enable parsing of json bodies for post requests

// mongoose.Promise = global.Promise;
server.use(bodyParser.json());

// TODO: write your route handlers here
// server.get('/accepted-answer/:soID', (req, res) => {
//     const { soID } = req.params;
// })

module.exports = { server };
