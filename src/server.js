/* eslint-disable */

const bodyParser = require("body-parser");
const express = require("express");

const Post = require("./post.js");

const STATUS_USER_ERROR = 422;

const server = express();
// to enable parsing of json bodies for post requests

server.use(bodyParser.json());

// TODO: write your route handlers here
server.get("/accepted-answer/:soID", function(req, res) {
  const soID = req.params.soID;
  Post.findOne({ soID })
    .then(function(posts) {
      const acceptedAnswerID = posts.acceptedAnswerID;
      Post.findOne({ soID: acceptedAnswerID }).then(function(posts) {
        if (posts) {
          res.status(200).json(posts);
        } else {
          res.status(422).json({ error: "No accepted answer" });
        }
      });
    })
    .catch(function() {
      res.status(422).json({ error: "The information could not be found" });
    });
});

server.get("/top-answer/:soID", function(req, res) {
  const soID = req.params.soID;
  Post.findOne({
    soID: soID
  })
    .then(function(question) {
      // console.log("question", question);
      const acceptedAnswerID = question.acceptedAnswerID;
      // console.log("acceptedanswerID", acceptedAnswerID);
      Post.find({
        parentID: soID,
        acceptedAnswerID: { $ne: acceptedAnswerID }
      })
        .limit(1)
        .sort({ score: -1 })
        .then(function(answers) {
          console.log("answer", answers);
          const parentID = answers.parentID;
          // console.log("posts.parentID", answers.parentID);
          res.status(200).json(answers[0]);
        });
    })

    .catch(function() {
      res.status(422).json({ error: "The information could not be found" });
    });
});

module.exports = { server };
