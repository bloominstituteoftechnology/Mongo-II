const fs = require('fs');
const Post = require('./post');
const posts = require('../posts.json');
const mongoose = require('mongoose');


let savedPosts = null;

const readPosts = () => {
  // cache posts after reading them once
  if (!savedPosts) {
    const contents = fs.readFileSync('posts.json', 'utf8');
    savedPosts = JSON.parse(contents);
  }
  return savedPosts;
};

mongoose.Promise = global.Promise;
mongoose.connect(
  'mongodb://localhost/posts',
  { useMongoClient: true }
);

const populatePosts = () => {
  // TODO: implement this
  // savedPosts = readPosts();
  readPosts();
  const promises = savedPosts.map(post => new Post(post).save());
  return Promise.all(promises);
  // const populateSOPosts = () => {
  //   const allPosts = posts;
  //   const promises = allPosts.map(p => new Post(p).save());
  //   return Promise.all(promises);
  // };
  // /* eslint no-console: 0 */
  // return populateSOPosts()
  //   .then(() => {
  //     console.log('done');
  //     mongoose.disconnect();
  //   })
  //   .catch((err) => {
  //     console.log('ERROR', err);
  //     throw new Error(err);
  //   });
};

// populatePosts();
populatePosts().then((allPosts) => {
  // console.log('DUN and DONE!!!!!!');
  return allPosts;
});

module.exports = { readPosts, populatePosts };
