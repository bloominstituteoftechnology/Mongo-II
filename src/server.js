const bodyParser = require('body-parser')
const express = require('express')
const errors = require('./errors.js')

const Post = require('./post.js')

const STATUS_USER_ERROR = 422

const server = express()
// to enable parsing of json bodies for post requests

server.use(bodyParser.json())

// TODO: write your route handlers here

// Provide the accepted answer for a given post ID
server.get('/accepted-answer/:soID', (req, res, next) => {
  const { soID } = req.params
  Post.findOne({ soID })
    .then(post => {
      if (post.acceptedAnswerID) {
        Post.findOne({ soID: post.acceptedAnswerID })
        .then(answer => res.send(answer))
        .catch(() => next(errors.serverError))
      } else {
        next(errors.noAcceptedAnswer)
      }
    })
    .catch(() => next(errors.noPostWithId))
})

// Provide the top voted answer for a given post ID
server.get('/top-answer/:soID', (req, res, next) => {
  const { soID } = req.params
  Post.findOne({ soID })
    .then(post => {
      Post.find({ soID: { $ne: post.acceptedAnswerID } })
        .sort({ score: -1 })
        .limit(1)
        .then(answer => res.send(answer))
        .catch(() => next(errors.serverError))
    })
    .catch(() => next(errors.noPostWithId))
})

// Provide the jquery questions with either score > 5,000 or
// posted by a user with > 200,000 reputation
server.get('/popular-jquery-questions', (req, res, next) => {
  Post.find({
    tags: 'jquery',
    $or: [
      { score: { $gt: 5000 } },
      { 'user.reputation': { $gt: 200000 } }
    ]
  }).then(posts => res.send(posts))
    .catch(() => next(errors.serverError))
})

server.use((error, req, res, next) => {
  res.status(error.status).send({ error: error.message })
})

module.exports = { server }
