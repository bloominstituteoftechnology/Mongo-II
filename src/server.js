/* eslint-disable */
const bodyParser = require('body-parser');
const express = require('express');

const Post = require('./post.js');

const STATUS_USER_ERROR = 422;

const server = express();
// to enable parsing of json bodies for post requests

server.use(bodyParser.json());

// TODO: write your route handlers here
server.get('/accepted-answer/:soID', (req, res) => {
    const { soID } = req.params;

    Post.findOne({ soID }, 'acceptedAnswerID', (err, result) => {
        if (err) res.status(422).json(err);
        if (!result) res.status(422).json({ error: 'no data found matching criteria' });
        Post.findOne({ soID: result.acceptedAnswerID }, '', (err, result2) => {
            if (err) res.status(422).json(err);
            if (!result2) res.status(422).json({ error: 'no data found matching criteria' });
            res.status(200).json(result2);
        });
    })
});

server.get('/top-answer/:soID', (req, res) => {
    const { soID } = req.params;
    Post.findOne({ soID }, '', (err, result) => {
        if (err) res.status(422).json(err);
        if (!result) res.status(422).json({ error: 'no data found matching criteria' });
        const notTheAcceptedAnswerID = result.acceptedAnswerID == null ? -1 : result.acceptedAnswerID; // Insurance check on acceptedAnswerID...
        Post.find()
            .where('parentID').equals(soID) // Find all that have the parentID matching soID
            .where('soID').ne(notTheAcceptedAnswerID) // Exclude the original posts, acepted answer
            .sort({ score: 'desc' })
            .exec()
            .then((posts, error) => {
                if (error) res.status(500).json(error);
                if (!posts) res.status(422).json({ error: 'no answers found matching the criteria.' });
                if (posts.length === 0) res.status(500).json({ error: 'no answers found matching the criteria.' });
                res.status(200).json(posts[0]); // return as the result the top item in the array of results.
            })
            .catch(userError => {
                res.status(422).json({ error: 'no answers found matching criteria', userError });
            });
    });
});

server.get('/popular-jquery-questions', (req, res) => {
    Post.find()
        .where('tags').in(['jquery'])
        // .where('score').gt(5000)
        // .where('user.reputation').gt(200000) 
        .where({ $or: [{ score: { $gt: 5000 } }, { 'user.reputation': { $gt: 200000 } }] }) // Score and User Reputation Or Statement!
        .where('parentID').equals(null)
        .exec()
        .then((posts, error) => {
            if (error) res.status(500).json(error);
            if (!posts) res.status(422).json({ error: 'no data found matching criteria' });
            res.status(200).json(posts);
        })
        .catch(userError => {
            res.status(422).json({ error: 'no data found matching criteria', userError });
        });
});

server.get('/npm-answers', (req, res) => {
    Post.find()
        .where('tags').in(['npm'])
        .where('parentID').equals(null)
        .select('soID -_id')
        .exec()
        .then((results, error) => {
            if (error) res.status(500).json(error);
            if (!results) res.status(422).json({ error: 'no data found matching criteria' });
            Post.find()
                .where('parentID').in(results.map(post => post.soID)) // Maping over the results post soID and finding all posts that contain that information.
                .exec()
                .then((foundPosts, findError) => {
                    if (findError) throw findError;
                    if (!foundPosts) res.status(422).json({ error: 'no data found matching criteria' });
                    res.status(200).json(foundPosts);
                })
                .catch(err => {
                    res.status(500).json({ error: 'no data found matching criteria', err });
                })
        })
        .catch(userError => {
            res.status(422).json({ error: 'no data found matching criteria', userError });
        });
});

module.exports = { server };
