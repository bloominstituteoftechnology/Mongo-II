const fs = require('fs');
const mongoose = require('mongoose');

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
  let posts = readPosts();
  console.log(posts);
}

mongoose
  .connect('mongodb://localhost/so-posts')//enters mongoDB, creates a collection
  .then(() => {
    Post.create(readPosts())// create collection of posts
      .then(() => {
        console.log('population succedded');
        mongoose.disconnect();// leaves mongoDB
      })
      .catch(error => {
        console.error('population failed');
      });
  })
  .catch(error => {
    console.error('database connection failed');
  });

module.exports = { populatePosts, savedPosts };