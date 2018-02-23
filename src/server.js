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
  Post.find()
    .limit(10)
    .then(results => {
      res.status(200).json(results);
    })
    .catch(err => {
      res.status(500).json({ error: "Nope " });
    });
});

server.get("/accepted-answer/:soID", (req, res) => {
  const { soID } = req.params;
  // find Post
  Post.findOne({ soID })
    .select("acceptedAnswerID")
    .then(result => {
      Post.findOne({ soID: result.acceptedAnswerID })
        .then(answer => {
          res.status(200).json(answer);
        })
        .catch(err => {
          res.status(404).json({ err: " stop being wrong" });
        });
    })
    .catch(err => {
      res.status(404).json({ error: "hah dummy" });
    });
});

server.get("/top-answer/:soID", (req, res) => {
  // Find the question with the given soID (1 query).
  // aaId = 111111
  const { soID } = req.params;
  Post.findOne({ soID })
    .then(result => {
      const acceptedAnswer = result.acceptedAnswerID;
      Post.find({ parentID: soID })
        .sort("-score")
        .then(results => {
          if (results[0].soID === acceptedAnswer) {
            res.status(200).json(results[1]);
          } else {
            res.status(200).json(results[0]);
          }
          // res.status(200).json(results);
        })
        .catch(err => {
          res.send(err);
        });
    })
    .catch(err => {
      res.status(500).json({ err });
    });
  // Send back a JSON response with the single top answer post object.
});
module.exports = { server };
