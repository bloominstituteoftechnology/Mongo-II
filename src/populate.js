/* eslint-disable */
const mongoose = require("mongoose");
const fs = require("fs");

let savedPosts = null;

const Post = require("./post.js");

const readPosts = () => {
  // cache posts after reading them once
  if (!savedPosts) {
    const contents = fs.readFileSync("posts.json", "utf8");
    savedPosts = JSON.parse(contents);
  }
  return savedPosts;
};

// const getPosts = new Promise readPosts();

const populatePosts = () => {
  // TODO: implement this
  readPosts().then(result => {
    mongoose
      .connect("mongodb://localhost/so-posts", { useMongoClient: true })
      .then(db => {
        console.log("connected to the db");
        // Post.create(savedPosts)
      })
      .catch();
  });
};
populatePosts();
module.exports = { readPosts, populatePosts };
