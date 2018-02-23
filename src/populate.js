const fs = require('fs');
const mongoose = require('mongoose');

let savedPosts = null;

const Post = require('./post.js');

const readPosts = () => {
  // cache posts after reading them once
  if (!savedPosts) {
    const contents = fs.readFileSync('posts.json', 'utf8');
    savedPosts = JSON.parse(contents);
  }
  return savedPosts;
};

const populatePosts = () => {
	mongoose.connect('mongodb://localhost/so-posts')
		.then(db => {
			const posts = readPosts();

			Post.create(posts)
				.then(() => {
					console.log('Posts added!');
					mongoose.disconnect();
				})
				.catch(error => {
					console.log(error);
					mongoose.disconnect();
				})
		})
		.catch(error => {
			console.log(error)
		})
}

populatePosts();

module.exports = { readPosts, populatePosts };
