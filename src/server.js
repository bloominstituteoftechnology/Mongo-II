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
    .then(question => {
      const acceptedAnswerID = question.acceptedAnswerID;
      Post.findOne({ soID: acceptedAnswerID }).then(answer => {
        if (answer) {
          res.status(200).json(answer); // if question and answer
        } else {
          res.status(422).json({ error: "No accepted answers." }); // question found but no answer
        }
      });
    })
    .catch(error => {
      res.status(422).json({ error: "No question found." }); // no question found
    });
});

server.get("/top-answer/:soID", function(req, res) {
  const soID = req.params.soID;
  Post.findOne({ soID: soID })
    .then(question => {
      // find question object
      const acceptedAnswerID = question.acceptedAnswerID; // get the acceptedAnswerID from the question object
      Post.find({
        parentID: soID, // soID to get the parentID,
        soID: { $ne: acceptedAnswerID } // excluding the acceptedAnswerID
      })
        .sort("-score") // find highest score
        .then(highestScore => {
          if (highestScore.length != 0) {
            res.status(200).json(highestScore[0]); // return answer object
          } else {
            res.status(422).json({ error: "No highest score" }); // no high score found
          }
        });
    })
    .catch(err => {
      res.status(422).json({ error: "Couldn't find post with given ID" }); // no matching answer to question
    });
});

server.get("/popular-jquery-questions", function(req, res) {
  Post.find({
    tags: "jquery",
    $or: [{ score: { $gt: 5000 } }, { "user.reputation": { $gt: 200000 } }]
  })
    .then(answer => {
      res.status(200).json(answer);
    })
    .catch(err => {
      res.status(422).error(err);
    });
});

server.get("/npm-answers", (req, res) => {
  Post.find({ tags: "npm" })
    .then(questions => {
      const soIDsArray = questions.map(question => question.soID);
      Post.find({ parentID: soIDsArray })
        .then(qnA => {
          res.status(200).json(qnA);
        })
        .catch(err => {
          res.status(422).json(err);
        });
    })
    .catch(err => {
      res.tatus(422).json(err);
    });
});

module.exports = { server };
