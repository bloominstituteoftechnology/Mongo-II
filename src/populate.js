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
  const postPromises = posts.map((post) => {
    return new Post(post).save();
  });
  return Post.all(postPromises);
};

module.exports = { readPosts, populatePosts };
