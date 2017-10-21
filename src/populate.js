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
  const promises = posts.map(p => new Post(p).save());
  return Promise.all(promises).then(() => {
    console.log('done');
  });
};

module.exports = { readPosts, populatePosts };
