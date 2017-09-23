const express = require('express');
const Controller = require('./controllers');

const router = express.Router();

router
  .route('/accepted-answer/:soID')
  .get(Controller.acceptedAnswer);

router
  .route('/top-answer/:soID')
  .get(Controller.topAnswer);

router
  .route('/popular-jquery-questions')
  .get(Controller.popularJQueryQuestions);

router
  .route('/npm-answers')
  .get(Controller.npmAnswers);

module.exports = router;
