const Post = require('./post');

// error generator
const newError = require('./errors').newError;

const getAcceptedAnswer = async (soID) => {
  if (Number(soID)) {
    const origin = await Post.findOne({ soID });
    if (origin) {
      const answer = await Post.findOne({ soID: origin.acceptedAnswerID });
      if (answer) {
        return answer;
      }
      return newError(422, 'Failed to find post by acceptedAnswerID');
    }
    return newError(422, 'Failed to find post by soID provided');
  }
  return newError(422, 'Not a valid soID');
};

const getTopAnswer = async (soID) => {
  if (Number(soID)) {
    const origin = await Post.findOne({ soID });
    if (origin) {
      const answer = await Post.find({
        parentID: soID,
        soID: { $ne: origin.acceptedAnswerID }
      }).limit(1).sort('-score');
      if (answer[0]) {
        return answer[0];
      }
      return newError(422, 'Failed to find top answer post');
    }
    return newError(422, 'Failed to find post by soID provided');
  }
  return newError(422, 'Not a valid soID');
};

const getPopularJQueryQuestions = async () => {
  const questions = await Post.find({
    tags: { $all: ['jquery'] },
    $or: [{ score: { $gt: 5000 } }, { 'user.reputation': { $gt: 200000 } }]
  });
  if (questions.length > 0) {
    return questions;
  }
  return newError(422, 'Failed to find popular jQuery posts');
};

const getNpmAnswers = async () => {
  const taggedNpm = await Post.find({
    tags: { $all: ['npm'] }
  });
  if (taggedNpm.length > 0) {
    const parentIds = taggedNpm.map(post => post.soID);
    const answers = await Post.find({
      parentID: { $in: parentIds }
    });
    if (answers.length > 0) {
      return answers;
    }
    return newError(422, 'Failed to find Npm answers');
  }
  return newError(422, 'Failed to find Npm answers');
};

module.exports = {
  getNpmAnswers,
  getPopularJQueryQuestions,
  getAcceptedAnswer,
  getTopAnswer
};
