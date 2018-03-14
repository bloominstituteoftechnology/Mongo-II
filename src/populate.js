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
  const posts = readPosts()
  const postPromise = posts.map(post => new Post(post).save());
  return Promise.all(postPromise);
}

populatePosts();

mongoose
  .connect('mongodb://localhost/so-posts')
  .then(() => {
    Post.create(readPosts())
      .then(() => {
        console.log('population succedded');
        mongoose.disconnect();
      })
      .catch(error => {
        console.error('population failed');
      });
  })
  .catch(error => {
    console.error('database connection failed');
  });
