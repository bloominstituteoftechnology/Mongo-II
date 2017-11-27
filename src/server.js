const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const express = require('express');

const Post = require('./post.js');

const STATUS_USER_ERROR = 422;
const STATUS_SERVER_ERROR = 500;


const server = express();
// to enable parsing of json bodies for post requests

server.use(bodyParser.json());

// TODO: write your route handlers here
mongoose.Promise = global.Promise;

server.get('/accepted-answer/:soID', (req, res) => {
    const { soID } = req.params;
    // Post.find('soID', soID).exec((err, posts) => {
    //     if (err)
    // })
})

module.exports = { server };
