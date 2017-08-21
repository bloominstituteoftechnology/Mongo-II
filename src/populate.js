const fs = require('fs');
const Post = require('./post');
const posts = require('../posts.json');
const mongoose = require('mongoose');

let savedPosts = null;

mongoose.Promise = global.Promise;
mongoose.connect(
  'mongodb://localhost/so-posts',
  { useMongoClient: true }
);

const readPosts = () => {
  // cache posts after reading them once
  if (!savedPosts) {
    const contents = fs.readFileSync('posts.json', 'utf8');
    savedPosts = JSON.parse(contents);
  }
  return savedPosts;
};

const populatePosts = () => {
  const allPosts = readPosts();
  const promises = allPosts.map(p => new Post(p).save());

  return Promise.all(promises);
};

module.exports = { readPosts, populatePosts };
