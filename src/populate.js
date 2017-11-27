const fs = require('fs');

let savedPosts = null;

const Post = require('./post.js');

mongoose.Promise = global.Promise;
mongoose.connect(
  `mongodb://localhost/posts`,
  { useMongoClient: true }
);

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
  const promises = allPosts.map( post => new Post(post).save());
  return Promise.all(promises);
};

module.exports = { readPosts, populatePosts };
