// In `src/server.js`, add a route handler for `GET /accepted-answer/:soID`. When
// the client makes a `GET` request to `/accepted-answer/:soID`:

// 1. Find the question with the given `soID` (1 query).
// 2. Find the accepted answer of the question by using the `acceptedAnswerID`
//  field (1 query).
// 3. Send back a JSON response with the single accepted answer post object.

// You should *only* use 2 queries, and no more, for this route. If there's any
// error, or if there is no accepted answer, report it with an appropriate message
// and status code.


const bodyParser = require('body-parser');
const express = require('express');

const Post = require('./post.js');

const STATUS_USER_ERROR = 422;

const server = express();
// to enable parsing of json bodies for post requests

server.use(bodyParser.json());

// TODO: write your route handlers here

module.exports = { server };
