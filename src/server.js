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

server.get("/top-answer/:soID", (req, res, next) => {
  const { soID } = req.params;
  Post.findOne({ soID })
    .then(post => {
      if (post) {
        Post.findOne({ soID: { $ne: post.acceptedAnswerID } })
          .sort("-score")
          .limit(1)
          .then(response => {
            res.status(200).json(response);
          })
          .catch(error => {
            res.status(500).json(error);
          });
      } else {
        res.status(404).json({ message: "No such post found" });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

server.get("/popular-jquery-questions", (req, res, next) => {
  Post.find({
    $and: [
      { tags: "jquery" },
      {
        $or: [{ score: { $gt: 5000 } }, { "user.reputation": { $gt: 200000 } }]
      }
    ]
  })
    .then(post => {
      res.status(200).json(post);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

module.exports = { server };
