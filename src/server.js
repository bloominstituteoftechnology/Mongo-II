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

// server.get('/top-answer', (req, res) => {
//     Post.find({})
//     .then(answers => {
//         res.status(200).json(answers);
//     })
//     .catch(error => {
//         res.status(500).json({ error });
//     })
// })

server.get('/accepted-answer/:soID', (req, res) => {
    const { soID } = req.params;
    Post.findOne({ soID })
    .select('acceptedAnswerID')
    .then(result => {
        Post.findOne({ soID: result.acceptedAnswerID })
        .then(answer => {
            res.status(200).json(answer);
        })
    })
    .catch(error => {
        res.status(500).json({ error });
    })
})

server.get('/top-answer/:soID', (req, res) => {
    const { soID } = req.params;
    Post.findOne({ soID })
    .select('acceptedAnswerID')
    .then(result => {
        const accepted = result.acceptedAnswerID;
        Post.find({ parentID: soID })
        .sort('-score')
        .then(topResults => {
            if(topResults[0].soID === accepted) {
                res.status(200).json(topResults[1]);
            } else {
                res.status(200).json(topResults[0]);
            }
        })
    })
    .catch(error => {
        res.status(500).json({ error });
    })
})

module.exports = { server };
