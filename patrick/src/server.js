const bodyParser = require('body-parser');
const express = require('express');

const STATUS_USER_ERROR = 422;

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());

// TODO: write your route handlers here
const Post = require('./post');

// helper
const sendUserError = (err, res) => {
  res.status(STATUS_USER_ERROR);
  if (typeof err === 'string') {
    res.json({ error: err });
  } else {
    res.json(err);
  }
};

server.get('/accepted-answer/:soID', (req, res) => {
  const { soID } = req.params;
  Post.findOne({ soID })
    .exec((err, post) => {
      if (!post) {
        sendUserError(err, res);
        return;
      }
      Post.findOne({ soID: post.acceptedAnswerID })
        .exec((error, answer) => {
          if (!answer) {
            sendUserError(error, res);
            return;
          }
          res.json(answer);
        });
    });
});

// server.get('/top-answer/:soID', (req, res) => {
//   const { soID } = req.params;
//   Post.findOne({ soID }, (err, post) => {
//     if (!post) {
//       sendUserError({ error: `User Error in top-answer with ${soID}` }, res);
//       return;
//     }
//     Post.find({ $and: [{ parentID: soID }, { soID: { $ne: post.acceptedAnswerID } }] }, (error, answers) => {
//       if (!answers || !answers.length) {
//         sendUserError({ error: 'User Error in top-answer find' }, res);
//         return;
//       }
//       const topAnswer = answers.reduce((ta, e) => {
//         return e.score > ta.score ? e : ta;
//       }, answers[0]);
//       res.json(topAnswer);
//     });
//   });
// });

server.get('/top-answer/:soID', (req, res) => {
  const { soID } = req.params;
  Post.findOne({ soID })
    .exec((err, post) => {
      if (!post) {
        sendUserError(err, res);
      } else {
        const soIDv = soID;
        const acceptedID = post.acceptedAnswerID;
        Post.find({ parentID: { $eq: soID } })
        .sort({ score: -1 })
        .exec((errs, answers) => {
          if (!answers) {
            sendUserError(errs, res);
            return;
          }
          for (let i = 0; i < answers.length; i++) {
            if (answers[i].soID !== acceptedID) {
              res.json(answers[i]);
            }
          }
          sendUserError(err, res);
        });
      }
    });
});


// server.get('/top-answer/:soID', (req, res) => {
//   const { soID } = req.params;
//   // console.log(soID);
//   Post.findOne({ soID })
//   .exec((err, post) => {
//     if (!post) {
//       sendUserError(err, res);
//       return;
//     }
//     // console.log(post);
//     Post.find({ parentID: { $eq: soID } }, { soID: { $ne: post.acceptedAnswerID } })
//     .sort({ score: -1 })
//     .exec((error, answer) => {
//       console.log(answer);
//       if (!answer) {
//         sendUserError(error, res);
//         return;
//       }
//       console.log(answer);
//       res.json(answer);
//     });
//   });
// });

server.get('/popular-jquery-questions', (req, res) => {
  // 1. Find all question posts that are tagged with `jquery` and *either* have
  //    a score greater than 5000, or are posted by a user with reputation greater
  //    than 200,000 (1 query).
  // 2. Send back a JSON response with an array of popular jquery questions.
  //
  // ( jQuery tag && ( score > 5000 || user rep > 200000) )
  //  { $and: [ { jQuerytag }, { <expression2> } , ... , { <expressionN> } ] }
  // {$and: [{jquery}, {$or: [{thing1}, {thing2}]}]}
  // { user: [{reputation: { $gt: 200000 }}]}
  Post.find({ $and: [{ tags: { $in: ['jquery'] } },
    { $or: [{ score: { $gt: 5000 } },
    { 'user.reputation': { $gt: 200000 } }] }] })
    .exec((err, post) => {
      if (!post) {
        sendUserError(err, res);
        return;
      }
      res.json(post);
    });
});
//
// server.get('/popular-jquery-questions', (req, res) => {
//   Post.find({ $and: [{ tags: { $in: ['jquery'] } }, { $or: [{ score: { $gt: 5000 } },
//   { 'user.reputation': { $gt: 200000 } }] }] })
//     .exec((err, post) => {
//       if (!post) {
//         sendUserError(err, res);
//       } else {
//         res.json(post);
//       }
//     });
// });

// server.get('/npm-answers', (req, res) => {
//   const tagged = [];
//   const results = [];
//   Post.find({ tags: { $in: ['npm'] } }).exec((err, post) => {
//     if (!post) {
//       sendUserError(err, res);
//       return;
//     }
//     // ids into array
//     // for each soID with npm tags, find all with parentIDs === soIDs
//     post.forEach((p) => {
//       tagged.push(p.soID);
//     });
//     console.log(tagged);
//     for (let i = 0; i < tagged.length; i++) {
//       const soIDTaggedNpm = tagged[i];
//       Post.find({ parentID: soIDTaggedNpm }).exec((error, answers) => {
//         if (!answer) {
//           sendUserError(error, res);
//           return;
//         }
//         results.push(answers)
//       });
//       res.json(results);
//     }
//   });
// });

server.get('/npm-answers', (req, res) => {
  const tagged = [];
  Post.find({ tags: { $in: ['npm'] } })
  .exec((err, post) => {
    if (!post) {
      sendUserError(err, res);
      return;
    }
    // ids into array, iterate over array of ids and search whole db for posts w/ matching parentIDs
    post.forEach((p) => {
      tagged.push(p.soID);
    });
    console.log(tagged);
    const answers = [];
    tagged.forEach((id) => {
      Post.find({ parentID: id })
      .exec((err44, apost) => {
        answers.push(apost);
      });
    });
    res.json(tagged);
  });
});

// ### `GET /npm-answers`
// When the client makes a `GET` request to `/npm-answers`:
// 1. Find all question posts that are tagged with `npm` (1 query).
// 2. Find all answers to all questions above (1 query).
// 3. Send back a JSON response with an array of answers to npm questions.


module.exports = { server };
