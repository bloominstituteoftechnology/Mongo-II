//Now that you have a schema in place, populate MongoDB by adding all the posts in
// `posts.json`. To do this, fill in the function `populatePosts()` in
// `src/populate.js`. `populatePosts()` should read the posts array by calling
// `readPosts()`, which we've given to you. Then, it should save each post to the
//database. `populatePosts()` should return *a promise* that resolves only when
// *all posts have successfully been added to the database*.

// Hints:
// - Calling `.save()` on a Post model without any arguments will return a promise
//  that resolves once that post is saved.
// - `Promise.all()` will come in handy here.

//After you write this function, make sure the `populatePosts() populates all
//posts` test passes (see `tests/populate.test.js`).

const Post = require('./post.js');
const Posts = require('../posts');
const mongoose = require('mongoose');
const fs = require('fs');

let savedPosts = null;


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
  const allPosts = posts;
  const promises = allPosts.map(p => new Post(p).save());
  return Promise.all(promises);
};


module.exports = { readPosts, populatePosts };