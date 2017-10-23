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
  const posts = readPosts();
  const promises = posts.map(post => new Post(post).save());
  return Promise.all(promises);
};

populatePosts()
  .then(() => {
    // console.log('done');
    mongoose.disconnect();
  })
  .catch((err) => {
    // console.log('ERROR', err);
    throw new Error(err);
  });

module.exports = { readPosts, populatePosts };
