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
  // TODO: implement this
  readPosts()
  mongoose.connect('mongodb://localhost/so-posts', { useMongoClient: true })
  	.then(
		  Post.create(savedPosts)
		  	.then((posts) =>{
		  		console.log('Posts added');
		  		mongoose.disconnect();
		  	})
		  	.catch((err) => {
		  		console.log({ error: "Couldn't connect." });
		  		mongoose.disconnect();
		  	})
  	)
  	.catch((err) => {
  		console.log({ error: err });
  	});
};

populatePosts();

module.exports = { readPosts, populatePosts };
