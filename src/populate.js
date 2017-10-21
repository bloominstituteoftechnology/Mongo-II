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

const populatePosts = async () => {
  const posts = readPosts();
  const promise = await Post.create(posts.map(post => post));
  return Promise.all(promise);
};

module.exports = { readPosts, populatePosts };
