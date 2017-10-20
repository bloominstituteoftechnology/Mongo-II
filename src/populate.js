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

// console.log(readPosts());

const populatePosts = () => {
  const posts = readPosts();
  const promises = posts.map(post => new Post(post).save());
  return Promise.all(promises)
    .then(() => {
      // console.log('done');
    })
    .catch((err) => {
      throw new Error(err);
    });
};

populatePosts();

module.exports = { readPosts, populatePosts };
