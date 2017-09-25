const fs = require('fs');
const dbConnect = require('./dbConnect');

const Post = require('../models/postModel');

let savedPosts = null;

const readPosts = () => {
  // cache posts after reading them once
  if (!savedPosts) {
    const contents = fs.readFileSync('./posts.json', 'utf8');
    savedPosts = JSON.parse(contents);
  }
  return savedPosts;
};

/* eslint no-console: 0 */
/* eslint no-underscore-dangle: 0 */


// Given solution
// const populatePosts = () => {
//   const posts = readPosts();
//   const postPromises = posts.map((post) => {
//     return new Post(post).save();
//   });
//   return Promise.all(postPromises);
// };

/* eslint no-return-await: 0 */
// cuts about .30 seconds off the insert compared with given solution
const populatePosts = async () => await Post.insertMany(
  readPosts().map(post => new Post(post))
);

module.exports = { readPosts, populatePosts };

// console.log(populatePosts());
