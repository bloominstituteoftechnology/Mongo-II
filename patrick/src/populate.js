const fs = require('fs');
const Post = require('./post');

const posts = require('../posts.json');
const mongoose = require('mongoose');

let savedPosts = null;

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
  readPosts();
  const promises = savedPosts.map(post => new Post(post).save());
  return Promise.all(promises);
  // return Promise.all(readPosts().map(p => new Post(p).save())); // <~~~ Does the same thing as above
};

module.exports = { readPosts, populatePosts };
