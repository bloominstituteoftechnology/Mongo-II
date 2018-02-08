const fs = require('fs');

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
  const postsJson = readPosts();
  return Post.insertMany(postsJson).then((posts) => {
    console.log('saved posts:', posts.length);
    return posts;
  }).catch((err) => {
    console.log(err);
  });
};

module.exports = { readPosts, populatePosts };
