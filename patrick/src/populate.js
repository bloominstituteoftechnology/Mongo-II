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
  'mongodb://localhost/post',
  { useMongoClient: true }
);

const populatePosts = () => {
  // TODO: implement this
  const populatePeople = () => {
    const allPeople = posts;
    const promises = allPeople.map(p => new Post(p).save());
    return Promise.all(promises);
  };

  return populatePeople()
    .then(() => {
      console.log('done');
      mongoose.disconnect();
    })
    .catch((err) => {
      console.log('ERROR', err);
      throw new Error(err);
    });
};

module.exports = { readPosts, populatePosts };
