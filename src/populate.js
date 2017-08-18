const fs = require('fs');
const Post = require('./post');
const posts = require('../posts.json');
const mongoose = require('mongoose');

let savedPosts = null;

mongoose.Promise = global.Promise;
mongoose.connect(
  'mongodb://localhost/so-posts',
  { useMongoClient: true }
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
  const popPost = () => {
    const allPosts = posts;
    const promises = allPosts.map(p => new Post(p).save());
    readPosts();
    return Promise.all(promises);
  };
};

populatePosts()
.then(() => {
  console.log('done');
  mongoose.disconnect();
})
.catch((err) => {
  console.log('error', err);
  throw new Error(err);
});

module.exports = { readPosts, populatePosts };
