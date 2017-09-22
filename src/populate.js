const fs = require('fs');
const Posts = require('./post');

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
  const posts = readPosts();
  const promise = posts.map(post => new Posts(post).save());
  return Promise.all(promise);
};

module.exports = { readPosts, populatePosts };
