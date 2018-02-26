const bodyParser = require('body-parser');
const express = require('express');

const Post = require('./post.js');

const STATUS_USER_ERROR = 422;

const server = express();
// to enable parsing of json bodies for post requests

server.use(bodyParser.json());

// TODO: write your route handlers here
server.get('/accepted-answer/:soID', (req, res) => {
	const id = req.params.soID;
	Post.findOne({soID: id})
		.select('acceptedAnswerID')
		.then(post => {
			Post.findOne({soID: post.acceptedAnswerID})
				.select('body score soID')
				.then(p => {
					res.status(200).json(p);
				})
		})
		.catch(error => {
			res.status(500).json({ error });
		})
});

server.get('/top-answer/:soID', (req, res) => {
	const id = req.params.soID;
	Post.findOne({soID: id})
		.then(post => {
			Post.find({$and: [{parentID: id}, {soID: {$ne: post.acceptedAnswerID}}]})
				.select('body score soID')
				.limit(1)
				.sort('-score')
				.then(p => {
					res.status(200).json(p);
				})
		})
		.catch(error => {
			res.status(500).json({ error });
		})
});

server.get('/popular-jquery-questions', (req, res) => {
	Post.find({tags: 'jquery'})
		.then(post => {
			Post.find({$or: [{score: {$gt: 5000}}, {'user.reputation': {$gt: 200000}}]})
				.select('score user.reputation body')
				.then(p => {
					res.status(200).json(p);
				})
		})
		.catch(error => {
			res.status(500).json({ error });
		});
});

server.get('/npm-answers', (req, res) => {
	Post.find({tags: 'npm'})
		.then(posts => {
			posts.forEach(post => {
				Post.find({parentID: post.soID})
					.select('body')
					.then(p => {
						res.status(200).json(p);
					})
			})
		})
		.catch(error => {
			res.status(500).json({ error })
		})
})

module.exports = { server };
