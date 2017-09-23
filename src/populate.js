const fs = require('fs');

const Post = require('./post');

let savedPosts = null;

const readPosts = () => {
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

module.exports = { readPosts, populatePosts };
