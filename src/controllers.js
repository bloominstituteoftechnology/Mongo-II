const Post = require('./post.js');
const { handleErr, getPost } = require('./helpers');

module.exports = {
  acceptedAnswer: async (req, res) => {
    const { soID } = req.params;
    const post = await getPost({ soID }, res);
    if (post) {
      const answer = await Post.findOne({ soID: post.acceptedAnswerID });
      return answer
        ? res.json(answer)
        : handleErr(404, 'No post found matching query', res);
    }
  },

  topAnswer: async (req, res) => {
    const { soID } = req.params;
    const post = await getPost({ soID }, res);
    if (post) {
      const answer = await Post.findOne({ parentID: post.soID })
        .where({ soID: { $ne: post.acceptedAnswerID } })
        .sort('-score');
      return answer
        ? res.json(answer)
        : handleErr(404, 'No post found matching query', res);
    }
  },

  popularJQueryQuestions: async (req, res) => {
    const posts = await Post.find({
      tags: { $in: ['jquery'] },
      $or: [{ score: { $gt: 5000 } }, { 'user.reputation': { $gt: 200000 } }]
    });
    return posts.length
      ? res.json(posts)
      : handleErr(404, 'No posts found matching query', res);
  },

  npmAnswers: async (req, res) => {
    const posts = await Post.find({ tags: { $in: ['npm'] } });
    if (posts.length) {
      const ids = posts.map(post => post.soID);
      const answers = await Post.find({ parentID: { $in: ids } });
      return answers
        ? res.json(answers)
        : handleErr(404, 'No posts found matching query', res);
    }
    return handleErr(404, "No posts found matching query 'npm'", res);
  }
};