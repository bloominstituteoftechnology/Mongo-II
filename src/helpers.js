const Post = require('./post.js');

const handleErr = (status, message, res) => {
  res.status(status).json({ Error: message });
  return;
};

const getPost = async ({ soID }, res) => {
  if (isNaN(soID)) return handleErr(422, 'Invalid post ID', res);
  const post = await Post.findOne({ soID });
  if (!post) return handleErr(422, 'Invalid post ID', res);
  return post;
};

module.exports = { handleErr, getPost };
