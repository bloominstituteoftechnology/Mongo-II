const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const express = require('express');

const Post = require('./post.js');

const STATUS_USER_ERROR = 422;
const STATUS_SERVER_ERROR = 500;


const server = express();
// to enable parsing of json bodies for post requests

server.use(bodyParser.json());

mongoose.Promise = global.Promise;

// write a helper method to offload the work for errorhandling
// err, objectQueried, res

const myErrorHandler = (err, obj) => {
    res.status(STATUS_USER_ERROR);
    if (typeof err === 'string') {
        
    }
    res.json(err);
}

server.get('/accepted-answer/:soID', (req, res) => {
    const { soID } = req.params;
    Post.findOne({ soID }, (err1, foundPost) => {
        if (!foundPost) {
            myErrorHandler('There is no post found by that soID', res);
            return;
        }
        Post.findOne(
            { soID: foundPost.acceptedAnswerID },
            (err2, acceptedAnswer) => {
                if (err2 || acceptedAnswer === null) {
                    res.status(STATUS_USER_ERROR).json(err2);
                    return;
                }
                res.json(acceptedAnswer);
            },
        );
    });
    // findOne document by given id
});

server.get('/top-answer/:soID', (req, res) => {
    const { soID } = req.params;
    Post.findOne(soID, (err, post) => {
        if (!post) {
            myErrorHandler('There is no post by that soID', res);
            return;
        }
        res.json(post);
        // post.soID --> parentID post.acceptedAnswerID --> $ne soID
        // sort by desc

        // This is one query
        Post.findOne({soID: { $ne: post.acceptedAnswerID }, parentID: post.soID })
        .sort({ score: 'desc'})
        .exec((err2, sortedAnswer) => {
            if (!sortedAnswer) {
                myErrorHandler('', res);
                return;
            }
            res.json(sortedAnswer);
        });
    });
});

server.get('/popular-jquery-questions', (req, res) => {
    // parentID: null
    // where tags include jquery
    // $or : [ score: $gt 5000,
    // user.reputation $gt 200k ]
    Post.find({
        parentID: null,
        tags: 'jquery',
        $or: [{score: { $gt: 5000} }, {'user.reputation': { $gt: 200000 } }]
    })
    .exec((err, posts) => {
        if (err || posts.length === 0) {
            myErrorHandler(err, res);
            return;
        }
        res.json(posts);
    });
});

server.get('/npm-answers', (req, res) => {
    Post.find({
        tags: 'npm'
        },
        (err, questions) => {
                if (err || question.length === 0) {
                myErrorHandler(err, res);
                return;
                }
            // 2nd Query
            Post.find({
            // loop over array of questions
            //match where questions soID === parentID
                parentID: { $in: questions.map(question = question.soID) },
            })
            .exec((err1, answers) => {
                if (err1) {
                    myErrorHandler(err1, res);
                    return;
                }
                res.json(questions);
            })
        },
    );
});

// server.get('/accepted-answer/:soID', (req, res) => {
//     const { soID } = req.params;
//     Post
//         .find({ soID: soID })
//         .select('acceptedAnswerID')
//         .exec((err, answer) => {
//             if (err) {
//                 res.status(STATUS_USER_ERROR).json({ 'Error: ': err });
//                 return;
//             }
//             res.json(answer);
//         });
// });

// server.get('/top-answer/:soID', (req, res) => {
//     const { soID } = req.params;
//     Post
//         .find({ soID: soID }, (err, post) => {
//         })
//         .select('')
// })

module.exports = { server };
