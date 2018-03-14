const fs = require('fs');
const mongoose = require('mongoose');

let savedPosts = null;

const Post = require('./post.js');


const populatePosts = () => {
  readPosts();
  // console.log(readPosts()); THEY BOTH SHOW SAME THING
  // console.log(savedPosts); ""

  console.log(typeof savedPosts);
  let tempArr = savedPosts;
  tempArr.forEach(
    element => {
      const post = new Post 
      ({ soID, parentID, url, title, body, score, tags, acceptedAnswerID, user });
      post.save()
      .then(posts => {
        return posts;
      })
      .catch(err => {
        return err;
      })
      Promise.all(tempArr)
      .then(posts => {
        return posts;
      })
      .catch(err => {
        return err;
      })
      }
  );
}
//   const posts = new Post ({ tempArr });
//   posts.save() 
//     .then(posts => {
//       return posts;
//     })
//     .catch(err => {
//       return err;
//     })
//   Promise.all(posts)
//     .then(posts => {
//       return posts;
//     })
//     .catch(err => {
//       return err;
//     })
// };

const readPosts = () => {
  // cache posts after reading them once
  if (!savedPosts) {
    const contents = fs.readFileSync('posts.json', 'utf8');
    savedPosts = JSON.parse(contents);
  }
  return savedPosts;
};

mongoose
  .connect('mongodb://localhost/so-posts')//enters mongoDB, creates a collection
  .then(() => {
    Post.create(readPosts())// create collection of posts
      .then(() => {
        console.log('population succedded');
        mongoose.disconnect();// leaves mongoDB
      })
      .catch(error => {
        console.error('population failed');
      });
  })
  .catch(error => {
    console.error('database connection failed');
  });

module.exports = { populatePosts, savedPosts };