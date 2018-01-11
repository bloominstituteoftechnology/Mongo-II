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
get(function() {
    return `${this.acceptedAnswerID} ${this.soID}`;
    {
      soID: 
      acceptedAnswerID:,
      post.find 
    }

  }
get(function() {
  return ${this.top-answer:soID} ${this.soID}
  { 
    soID: 
    top-answer:
    post.find
  }
get (function() {
  return ${this.popular-jquery-questions}
  {
    soID: 
    popular-jquery-questions:
    post.find
  }
  // When the client makes a `GET` request to `/popular-jquery-questions`:'

get (function() {
  return ${this.npm-answers}
  //When the client makes a `GET` request to `/npm-answers`:'
  {
    soID:
    npm-answers:
    post.find 
  }
}
}
module.exports = { server };

// ### `GET /accepted-answer/:soID`
// In `src/server.js`, add a route handler for `GET /accepted-answer/:soID`. When
// the client makes a `GET` request to `/accepted-answer/:soID`:

// 1. Find the question with the given `soID` (1 query).
// 2. Find the accepted answer of the question by using the `acceptedAnswerID`
 //  field (1 query).
// 3. Send back a JSON response with the single accepted answer post object.

// You should *only* use 2 queries, and no more, for this route. If there's any
// error, or if there is no accepted answer, report it with an appropriate message
// and status code.

// ### `GET /top-answer/:soID`
// When the client makes a `GET` request to `/top-answer/:soID`:

// 1. Find the question with the given `soID` (1 query).
// 2. Find the answer of the given question that has the *highest* score and *is
//   not the accepted answer* (1 query).
// 3. Send back a JSON response with the single top answer post object.

//You should *only* use 2 queries, and no more, for this route. If there's any
//error, or if there is no top answer, report it with an appropriate message
//and status code.

// ### `GET /popular-jquery-questions`
// When the client makes a `GET` request to `/popular-jquery-questions`:

// 1. Find all question posts that are tagged with `jquery` and *either* have
//   a score greater than 5000, or are posted by a user with reputation greater
//   than 200,000 (1 query).
//2. Send back a JSON response with an array of popular jquery questions.

// You should *only* use 1 query, and no more, for this route. If there's any
// error, report it with an appropriate message and status code.

//### `GET /npm-answers`
//When the client makes a `GET` request to `/npm-answers`:

//1. Find all question posts that are tagged with `npm` (1 query).
//2. Find all answers to all questions above (1 query).
//3. Send back a JSON response with an array of answers to npm questions.

//You should *only* use 2 queries, and no more, for this route. If there's any
//error, report it with an appropriate message and status code.


