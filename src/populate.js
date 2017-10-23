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
  const posts = readPosts();
  const postsPromises = posts.map((post) => {
    return new Post(post).save();
  });
  return Promise.all(postsPromises);
};

module.exports = { readPosts, populatePosts };
