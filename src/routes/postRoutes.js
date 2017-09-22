// error responder
const resError = require('../utils/errors').resError;

// Post methods
const PostMethods = require('../controllers/postController');

const postRoutes = (server) => {
  // ### `GET /accepted-answer/:soID`
  server.get('/accepted-answer/:soID', async (req, res) => {
    const response = await PostMethods.getAcceptedAnswer(req.params.soID);
    if (!response.error) {
      return res.json(response);
    }
    return resError(response.error, res);
  });

  // ### `GET /top-answer/:soID`
  server.get('/top-answer/:soID', async (req, res) => {
    const response = await PostMethods.getTopAnswer(req.params.soID);
    if (!response.error) {
      return res.json(response);
    }
    return resError(response.error, res);
  });

  // ### `GET /popular-jquery-questions`
  server.get('/popular-jquery-questions', async (req, res) => {
    const response = await PostMethods.getPopularJQueryQuestions();
    if (!response.error) {
      return res.json(response);
    }
    return resError(response.error, res);
  });

  // ### `GET /npm-answers`
  server.get('/npm-answers', async (req, res) => {
    const response = await PostMethods.getNpmAnswers();
    if (!response.error) {
      return res.json(response);
    }
    return resError(response.error, res);
  });
};

module.exports = postRoutes;
