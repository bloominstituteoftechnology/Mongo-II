const populatePosts = () => {
  const allPosts = readPosts();
  const promises = allPosts.map(p => new Post(p).save());
  return Promise.all(promises);
};


// GET

const Post = require('./post');

// helper
const sendUserError = (err, res) => {
  res.status(STATUS_USER_ERROR);
  if (typeof err === 'string') {
    res.json({ error: err});
  } else {
    res.json(err);
  }
};

server.get('/accepted-answer/:soID', (req, res) => {
  const { soID } = req.params;
  let selectAnswerID = '';
  Post.findOne({ soID: soID }
    .select('acceptedAnswerID');
    .exec((err, answer) => {
    if (!answer) {
      sendUserError('No answer found at that ID', res);
      return;
    }
    selectAnswerID = answer.acceptedAnswerID;
  })
  .then(() => {
    Post.find({ soID: selectedAnswerID }, (err, answer) => {
      if (!answer) {
        sendUserError('There is no accepted answer', err);
        return;
      }
      res.json(ans);
    });
  });
});
