const fs = require('fs');
const Post = require('./post.js');
const mongoose = require('mongoose');

let savedPosts = null;
// mongoose.Promise = global.Promise;
// mongoose.connect(
//   'mongodb://localhost/so-posts',
//   { useMongoClient: true }
// );

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
populatePosts().then((allPosts) => {
  return allPosts;
});


module.exports = { readPosts, populatePosts };
