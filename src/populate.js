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
  savedPosts.map((post) => {
  	Post(post).save()
  		.then((dbPost) => {
  			console.log('Post added')
  		})
  		.catch(err => {
  			console.log({ error: err });
  		});
  })
};

populatePosts();

module.exports = { readPosts, populatePosts };
