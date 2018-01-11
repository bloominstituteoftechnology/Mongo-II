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
  const allPosts = readPosts();
  const promises = allPosts.map(p => new Post(p).save());
  return Promise.all(promises);
};

populatePosts();
  // .then((message) => {
  //   res.status(200).json({ message: 'hello' });
  // })
  // .catch((err) => {
  //   console.log(err);
  // })

module.exports = { readPosts, populatePosts };
