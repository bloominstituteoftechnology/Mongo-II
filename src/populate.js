const fs = require('fs');
const mongoose = require('mongoose');

let savedPosts = null;

const Post = require('./post.js');

const populatePosts = () => {
  readPosts();
  let tempArr = savedPosts;
  const posts = new Post ({ tempArr });
  posts.save()
    .then(posts => {
      res.status(200).json(posts)
    })
    .catch(err => {
      res.status(500).json({error: "err"});
    })
  Promise.all(posts)
    .then(posts => {
      res.json({Success: "Nice!"});
    })
    .catch(err => {
      res.json({Error: err});
    })
};

const readPosts = () => {
  // cache posts after reading them once
  if (!savedPosts) {
    const contents = fs.readFileSync('posts.json', 'utf8');
    savedPosts = JSON.parse(contents);
  }
  return savedPosts;
};

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
