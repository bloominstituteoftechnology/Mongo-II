/* eslint-disable newline-per-chained-call */
const Posts = require('./post');

function getAcceptedAnswer(req, res) {
  const { soID } = req.params;
  // Find one question based on the ID parameter given
  Posts.findOne({ soID }).then((post) => {
    // Thrown errors will end the current function and jump to the 'catch' block
    if (!post) throw new Error('User not found');
    if (!post.acceptedAnswerID) throw new Error('No accepted answer found.');
    // return another Promise (the query for the accepted answer to the question)
    // Respond to the promise in another 'then' callback (this is called Promise chaining)
    // Catch will handle errors in every promise chain
    return Posts.findOne({ soID: post.acceptedAnswerID });
  }).then((answer) => {
    res.status(200).json(answer);
  }).catch((err) => {
    res.status(422).json({ error: err.message });
  });
}

function getTopAnswer(req, res) {
  const { soID } = req.params;
  // Find one question based on the ID parameter given
  Posts.findOne({ soID }).then((post) => {
    if (!post) throw new Error('Post not found');
    // Find an answer linked to the question we found, return the promise
    return Posts.findOne({ parentID: post.soID })
    // Skip the accepted answer (as called for by the README instructions)
    .where('soID').ne(post.acceptedAnswerID)
    // Sort by score descending (only finding one since the query is a findOne query)
    .sort({ score: -1 });
  }).then((answer) => {
    if (!answer) throw new Error('Answer not found');
    res.status(200).json(answer);
  }).catch((err) => {
    res.status(422).json({ error: err.message });
  });
}

function getPopularjQueryQuestions(req, res) {
  // Find all questions with the 'jquery' tag in the tags array
  Posts.find({ tags: 'jquery' })
  .then((posts) => {
    if (!posts.length) throw new Error('No posts found');
    // Filter posts that don't have a score of 5000 OR don't have a user reputation of 200000
    const filteredPosts = posts.filter((post) => {
      return post.score > 5000 || post.user.reputation > 200000;
    });
    res.status(200).json(filteredPosts);
  }).catch((err) => {
    res.status(422).json({ error: err.message });
  });
}

function getNpmAnswers(req, res) {
  // Find all questions with 'npm' in the tags array
  Posts.find({ tags: 'npm' }).then((posts) => {
    if (!posts.length) throw new Error('No posts found');
    // Take the IDs of all posts that were found
    const IDs = posts.map(post => post.soID);
    // Create a promise array searching for the answers of each question that was found
    const answerQuery = IDs.map(id => Posts.find({ parentID: id }));
    return Promise.all(answerQuery);
  }).then((answers) => {
    if (!answers.length) throw new Error('No answers found');
    // Promise.all will return an array of answers for each question
    // Flatten them into a single array of answers for the API 
    const flattenAnswers = answers.reduce((acc, next) => acc.concat(next));
    res.status(200).json(flattenAnswers);
  }).catch((err) => {
    res.status(422).json({ error: err.message });
  });
}

module.exports = {
  getAcceptedAnswer,
  getTopAnswer,
  getPopularjQueryQuestions,
  getNpmAnswers
};
