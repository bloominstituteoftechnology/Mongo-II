const fs = require('fs');
const mongoose = require('mongoose');

let savedPosts = null;

const Post = require('./post.js');

mongoose.Promise = global.Promise;
mongoose.connect(
  'mongodb://localhost/posts',
  { useMongoClient: true },
);

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
  const populate = () => {
    const posts = readPosts();
    Promise.all(posts);
    const promises = posts.map(post => new Post(post).save());
    return Promise.all(promises);
  };
  return populate()
    .then(() => { mongoose.disconnect(), console.log('done'); })
    .catch(err => console.log(err), mongoose.disconnect());
};
populatePosts();

module.exports = { readPosts, populatePosts };
