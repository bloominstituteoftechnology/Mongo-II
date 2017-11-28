const fs = require('fs');
const posts = require('../posts');
const mongoose = require('mongoose');
const Post = require('./post.js');

let savedPosts = null;

mongoose.Promise = global.Promise;

const readPosts = () => {
  // cache posts after reading them once
  if (!savedPosts) {
    const contents = fs.readFileSync('posts.json', 'utf8');
    savedPosts = JSON.parse(contents);
  }
  return savedPosts;
};

const populatePosts = () => {
  const populateAll = () => {
    const allPosts = posts;
    const promises = allPosts.map(post => new Post(post).save());
    return Promise.all(promises);
  };

  return populateAll()
    .then(() => {
      console.log('done');
      mongoose.disconnect();
    })
    .catch((err) => {
      console.log('ERROR', err);
      throw new Error(err);
    });
};

populatePosts();

module.exports = { readPosts, populatePosts };
