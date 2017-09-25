// error responder
const resError = require('../utils/errors').resError;

// Post methods
const PostMethods = require('../controllers/postController');

// Send response method
const sendResponse = (response, res) => !response.error
  ? res.json(response)
  : resError(response.error, res);


const postRoutes = (server) => {
  // ### `GET /accepted-answer/:soID`
  server.get('/accepted-answer/:soID', async (req, res) => sendResponse(
    await PostMethods.getAcceptedAnswer(req.params.soID),
    res
  ));

  // ### `GET /top-answer/:soID`
  server.get('/top-answer/:soID', async (req, res) => sendResponse(
    await PostMethods.getTopAnswer(req.params.soID),
    res
  ));

  // ### `GET /popular-jquery-questions`
  server.get('/popular-jquery-questions', async (req, res) => sendResponse(
    await PostMethods.getPopularJQueryQuestions(),
    res
  ));

  // ### `GET /npm-answers`
  server.get('/npm-answers', async (req, res) => sendResponse(
    await PostMethods.getNpmAnswers(),
    res
  ));
};

module.exports = postRoutes;
