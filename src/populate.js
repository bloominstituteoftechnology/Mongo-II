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
  // TODO: implement this
  const allPosts = readPosts();
  const promises = allPosts.map(p => new Post(p).save());
  return Promise.all(promises);
};

populatePosts()
  .then(() => {
    console.log('done');
  })
  .catch((err) => {
    console.log('ERROR', err);
    throw new Error(err);
  });

module.exports = { readPosts, populatePosts };
