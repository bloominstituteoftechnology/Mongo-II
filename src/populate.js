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
  const postContainer = [];
  readPosts().forEach(postObj => {
    const post = Post(postObj).save();
    postContainer.push(post);
  });

  return Promise.all(postContainer).then();
};

module.exports = { readPosts, populatePosts };
