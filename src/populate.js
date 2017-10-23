const fs = require('fs');

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
  readPosts();
  const promises = savedPosts.map((newPost) => {
    return new Post(newPost).save();
  });
  return Promise.all(promises);
};

module.exports = { readPosts, populatePosts };
