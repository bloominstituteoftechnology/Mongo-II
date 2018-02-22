/* eslint-disable */
const bodyParser = require("body-parser");
const express = require("express");

const Post = require("./post.js");

const STATUS_USER_ERROR = 422;

const server = express();
// to enable parsing of json bodies for post requests

server.use(bodyParser.json());

// TODO: write your route handlers here
server.get("/", (req, res) => {
  Post.find({})
    .limit(10)
    .then(answers => {
      res.status(200).json(answers);
    })
    .catch(error => {
      res.status(500).json({ error });
    });
});

server.get("/accepted-answer/:soID", (req, res) => {
  const { soID } = req.params;
  Post.find({ soID })
    .select("acceptedAnswerID")
    .then(acceptedAnswerID => {
      res.send(acceptedAnswerID);
    })
    //   Post.find({ acceptedAnswerID })
    //     .then(answer => {
    //       res.status(200).json(answer);
    //     })
    //     .catch(error => {
    //       res.status(500).json({ error });
    //     });
    // })
    .catch(error => {
      res.status(500).json({ error });
    });
});

module.exports = { server };
