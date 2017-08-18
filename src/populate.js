const Post = require('./post.js');
const fs = require('fs');

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
  const promises = savedPosts.map(p => new Post(p).save());
  return Promise.all(promises);
};

module.exports = { readPosts, populatePosts };
