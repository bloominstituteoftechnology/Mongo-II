const fs = require('fs');
const mongoose = require('mongoose');

let savedPosts = null;

const Posts = require('./post.js');

const readPosts = () => {
  // cache posts after reading them once
  if (!savedPosts) {
    const contents = fs.readFileSync('posts.json', 'utf8');
    savedPosts = JSON.parse(contents);
  }
  return savedPosts;
};

const populatePosts = () => {
  // const populate = () => {
  //   // TODO: implement this
  //   const allPost = readPosts();
  //   const promises = allPost.map(p => new Posts(p).save());
  //   return Promise.all(promises);
  const posts = readPosts();
  const promises = posts.map(p => new Posts(p).save());
  return Promise.all(promises);
};

//   return populate()
//     .then(() => {
//       console.log('done');
//       mongoose.disconnect();
//     })
//     .catch((err) => {
//       console.log('ERROR', err);
//       throw new Error(err);
//     });
// };

module.exports = { readPosts, populatePosts };
