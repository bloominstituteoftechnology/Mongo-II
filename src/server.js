const bodyParser = require("body-parser");
const express = require("express");

const Post = require("./post.js");

const STATUS_USER_ERROR = 422;

const server = express();
// to enable parsing of json bodies for post requests

server.use(bodyParser.json());

// TODO: write your route handlers here

server.get("/accepted-answer/:soID", (req, res, next) => {
  const { soID } = req.params;
  Post.findOne({ soID })
    .then(post => {
      Post.findOne({ soID: post.acceptedAnswerID })
        .then(answer => {
          if (answer) {
            res.status(200).json(answer);
          } else {
            res
              .status(404)
              .json({ message: "There is no answer with such ID" });
          }
        })
        .catch(error => {
          res
            .status(500)
            .json({ error: "The information could not be obtained" });
        });
    })
    .catch(error => {
      res.status(500).json({ error: "The information could not be obtained" });
    });
});

module.exports = { server };
