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
        })
        .catch(err => {
          res.send(err);
        });
    })
    .catch(err => {
      res.status(500).json({ err });
    });
});

server.get("/popular-jquery-questions", (req, res) => {
  //   Find all question posts that are tagged with jquery and either have a score greater than 5000, or are posted by a user with reputation greater than 200,000 (1 query).
  Post.find({
    tags: "jquery",
    $or: [{ "user.reputation": { $gt: 200000 } }, { score: { $gt: 5000 } }]
  })
    // Post.find()
    //   .where("tags")
    //   .in("jquery")
    //   .or([{ "user.reputation": { $gt: 200000 } }, { score: { $gt: 5000 } }])
    .then(results => {
      res.send(results);
    })
    .catch(err => {
      res.send(err);
    });
  // Send back a JSON response with an array of popular jquery questions.
});

server.get("/npm-answers", (req, res) => {
  Post.find()
    .where("tags")
    .in(["npm"])
    .then(results => {
      const soIdsArray = results.map(post => {
        return { parentID: post.soID };
      });
      Post.find()
        .or(soIdsArray)
        .then(answers => {
          res.send(answers);
        })
        .catch(err => {
          res.send({ err: "didn't work" });
        });
    })
    .catch(err => {
      res.send({ err: "err dummy" });
    });
});
module.exports = { server };
