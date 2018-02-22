/*  */

const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');

const Post = require('./post.js');

const STATUS_USER_ERROR = 422;

const server = express();
// to enable parsing of json bodies for post requests

server.use(bodyParser.json());

server.get('/', (req, res) => {
  res.status(200).json({ api: 'running' });
});

// TODO: write your route handlers here

module.exports = { server };
