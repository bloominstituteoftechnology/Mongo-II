// Based on the posts given above, and the
// `posts.json` file if you need more examples, fill in the `PostSchema`. Fields
//  `soID`, `url`, `body`, and `score` are required; all other fields are optional.
// Note that `tags` is an array of *strings* and `user` is a *nested object*; make
// sure you represent their schemas appropriately. Every field that is an id should
// be represented as a `Number`, not as an `ObjectId`, since these are not MongoDB
// references, but rather StackOverflow numeric identifiers.

const mongoose = require('mongoose');

// Clear out mongoose's model cache to allow --watch to work for tests:
// https://github.com/Automattic/mongoose/issues/1251
mongoose.models = {};
mongoose.modelSchemas = {};

mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/so-posts', { useMongoClient: true });

const PostSchema = new mongoose.Schema({
  // TODO: write your schema here 
    soID: {
      type: Number,
      required: true},
  
    
    url: {
      type: String, 
      required: true, 
     },

    body: {
       type: String, 
       required: true,
     },

    score: {
      type: String, 
      required: true, 
    },

    tags: [], 
    user: [],

      
    
});

module.exports = mongoose.model('Posts', PostSchema);

