const bodyParser = require('body-parser');
const express = require('express');

const Post = require('./post.js');

const STATUS_USER_ERROR = 422;
const handleError = (error, req, res, next) => {
  res.status(STATUS_USER_ERROR).send({ error, message: "Oops! Looks like that doesn't work :(" });
};

/*
###env
base_url = 'localhost:3000'
###env
*/

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());
server.use(handleError);

const asyncMiddleware = cb => (req, res, next) => {
  // express was refusing to use my middlware in server.use(handleError)
  Promise.resolve(cb(req, res, next)).catch(error => handleError(error, req, res, next));
};


/*
get(base_url + '/questions')
*/
server.get('/questions', asyncMiddleware(async (req, res, next) => {
  const questions = await Post.find({ parentID: null });
  if (questions.length === 0) {
    return handleError({ error: 'NoQuestions', message: 'Couldn\'t find any questions.' }, null, res, next);
  }
  res.send(questions);
}));

/*
get(base_url + '/question/' + '208105')
*/
server.get('/question/:soID', asyncMiddleware(async (req, res, next) => {
  const question = await Post.findOne({ parentID: null, soID: req.params.soID });
  if (question == null) {
    return handleError({ error: 'NoQuestion', message: 'Couldn\'t find the question.' }, null, res, next);
  }
  res.send(question);
}));

/*
get(base_url + '/question/' + '208105' + '/answers')
*/
server.get('/question/:soID/answers', asyncMiddleware(async (req, res, next) => {
  const answers = await Post.find({ parentID: req.params.soID }).sort({ score: -1 });
  if (answers.length === 0) {
    return handleError({ error: 'NoAnswers', message: 'This question has not been answered.' }, null, res, next);
  }
  res.send(answers);
}));

/*
get(base_url + '/accepted-answer/' + '21459196')
*/
server.get('/accepted-answer/:soID', asyncMiddleware(async (req, res, next) => {
  const question = await Post.findOne({ parentID: null, soID: req.params.soID });
  const answer = await Post.findOne({ soID: question.acceptedAnswerID });
  if (answer === null) {
    return handleError({ error: 'NoAcceptedAnswer', message: 'This question does not have an accepted answer.' }, null, res, next);
  }
  res.send(answer);
}));

/*
get(base_url + '/top-answer/' + '208105')
*/
server.get('/top-answer/:soID', asyncMiddleware(async (req, res, next) => {
  const question = await Post.findOne({ parentID: null, soID: req.params.soID });
  const answer = await Post.findOne({ parentID: req.params.soID, soID: { $ne: question.acceptedAnswerID } }).sort({ score: -1 });
  if (answer === null) {
    return handleError({ error: 'NoTopAnswer', message: 'Couldn\'t find a top answer for this question.' }, null, res, next);
  }
  res.send(answer);
}));

/*
get(base_url + '/popular-jquery-questions')
*/
server.get('/popular-jquery-questions', asyncMiddleware(async (req, res, next) => {
  const questions = await Post.find({
    parentID: null,
    tags: 'jquery',
    $or: [
      { score: { $gt: 5000 } },
      { 'user.reputation': { $gt: 200000 } }
    ]
  });
  if (questions.length === 0) {
    return handleError({ error: 'NoJQueryQuestions', message: 'Couldn\'t find any questions related to jQuery.' }, null, res, next);
  }
  res.send(questions);
}));

/*
get(base_url + '/npm-answers')
*/
server.get('/npm-answers', asyncMiddleware(async (req, res, next) => {
  const questions = await Post.find({ tags: 'npm' });
  const answers = await Post.find({ parentID: { $in: questions.map(question => question.soID) } });
  if (answers.length === 0) {
    return handleError({ error: 'NoNpmAnswers', message: 'Couldn\'t find any answers for questions with an \'npm\' tag.' }, null, res, next);
  }
  res.send(answers);
}));

module.exports = { server };
