const fs = require('fs');

let savedPosts = null;


const Post = require('./post.js');

const readPosts = () => {
  // cache posts after reading them once
  if (!savedPosts) {
    const contents = fs.readFileSync('./posts.json', 'utf8');
    savedPosts = JSON.parse(contents);
  }
  return savedPosts;
};

const populatePosts = () => {
  // TODO: implement this
  const promises = savedPosts.map(postData => new Post(postData).save());
  return Promise.all(promises);
};

module.exports = { readPosts, populatePosts };
