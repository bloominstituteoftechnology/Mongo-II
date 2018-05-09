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

server.use((error, req, res, next) => {
  res.status(error.status).send({ error: error.message })
})

module.exports = { server }
