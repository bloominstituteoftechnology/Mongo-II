const fs = require('fs');

let savedPosts = null;

const Post = require('./post.js');

const readPosts = () => {
  // cache posts after reading them once
  if (!savedPosts) { // if there are no savedPosts
    const contents = fs.readFileSync('posts.json', 'utf8'); // the contents are in the file posts.json, with encoding of utf8 <- most common encoding
    savedPosts = JSON.parse(contents); // use json to parse the contents of the file
  }
  return savedPosts; // gimmie dem posts
};

  const populatePosts = () => { // now populate the posts
  // TODO: implement this
    const allPosts = readPosts(); // instantiate the code above
    const promises = allPosts.map(p => new Post(p).save()); // create a promise that maps over the posts and creates a new Post object and save them to the db
    return Promise.all(promises); // return the Promise to make it real
  };

module.exports = { readPosts, populatePosts };
