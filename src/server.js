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
  Post.findOne({ soID })
    .select("acceptedAnswerID")
    .then(result => {
      Post.findOne({ soID: result.acceptedAnswerID })
        .then(answer => {
          res.status(200).json(answer);
        })
        .catch(error => {
          res.status(500).json({ error });
        });
    })
    .catch(error => {
      res.status(500).json({ error });
    });
});

server.get("/top-answer/:soID", (req, res) => {
  const { soID } = req.params;
  Post.findOne({ soID })
    .select("acceptedAnswerID")
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
        });
    })
    .catch(error => {
      res.status(500).json({ error });
    });
});

server.get("/popular-jquery-questions", (req, res) => {
  Post.find({
    tags: "jquery",
    $or: [{ score: { $gt: 5000 } }, { "user.reputation": { $gt: 200000 } }]
  })
    .then(results => {
      res.status(200).json(results);
    })
    .catch(err => {
      res.status(500).json({ err: "Nope" });
    });
});

server.get('/npm-answers', (req, res) => {
  Post.find({ tags: 'npm'})
    .then(results => {
      const soIDs = results.map(post => {
        return { parentID: post.soID};
      })
      Post.find().or(soIDs)
        .then(results => {
          res.status(200).json(results);
      })
      .catch(err => {
        res.status(500).json(err);
      })
    })
    .catch(err => {
      re.status(500).json({ err: "Still nope" });
    })
})

module.exports = { server };
