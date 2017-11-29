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
  // TODO: implement this
  const posts = readPosts();
  return Promise.all(posts.map((post) => {
    const p = new Post(post);
    return p.save();
  }));
};

module.exports = { readPosts, populatePosts };
