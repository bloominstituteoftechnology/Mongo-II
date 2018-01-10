const fs = require('fs');
const posts = require('../posts');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/posts', { useMongoClient: true });

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
  const populate = () => {
    const allPosts = posts;
    const promises = allPosts.map(p => new Post(p).save());
    
    return Promise.all(promises);    
  };

  return populate()
    .then(() => {
      console.log('success');
      mongoose.disconnect();
    })
    .catch(err => {
      console.log('ERROR', err);
      throw new Error(err);
    });

};

module.exports = { readPosts, populatePosts };
