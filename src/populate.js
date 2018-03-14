const fs = require('fs');
// const mongoose = require('mongoose');

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
  return Promise.all(
    readPosts().map(posts => new Post(posts).save())
  )
  .then((posts) => {
    console.log('population succeeded');
    mongoose.disconnect(posts);
  })
  .catch(error => {
    console.error('population failed');
  });
};


  // mongoose
  // .connect('mongodb://localhost/so-posts')
  // .then((posts) => {
  //   Post.create(readPosts(posts))
  //     .then((posts) => {
  //       console.log('population succeeded');
  //       mongoose.disconnect(posts);
  //     })
  //     .catch(error => {
  //       console.error('population failed');
  //     });
  // })
  // .catch(error => {
  //   console.error('database connection failed');
  // });

module.exports = { readPosts, populatePosts };

