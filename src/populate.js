const fs = require('fs');
const mongoose = require('mongoose');

let savedPosts = null;

const Post = require('./post.js');

const readPosts = () => {
  // cache posts after reading them once
  if (!savedPosts) {
    const contents = fs.readFileSync('../posts.json', 'utf8');
    savedPosts = JSON.parse(contents);
  }
  return savedPosts;
};

const populatePosts = () => {
  // TODO: implement this
  const allPosts = readPosts();
  const promises = allPosts.map(post => new Post(post).save());

  Promise.all(promises)
    .then(() => {
      console.log('done');
      mongoose.disconnect();
    })
    .catch((error) => {
      throw new Error(error);
    });
};

populatePosts();

module.exports = { readPosts, populatePosts };
