const populatePosts = () => {
  const allPosts = readPosts();
  const promises = allPosts.map(p => new Post(p).save());
  return Promise.all(promises);
};

// Wesley's technique:
const populatePosts = () => {
  return Promise.all(readPosts().map(p => new Post(p).save()));
};



// GET

// required file
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
    // res.json(answer);
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

// From Ryan:
server.get('/accepted-answer/:soID', (req, res) => {
  const { soID } = req.params;
  Post.findOne({ soID })
    .exec((err, post) => {
      if (!post) {
        sendUserError(err, res);
        return;
      }
      Post.findOne({ soID: post.acceptedAnswerID })
        .exec((error, answer) => {
          if (!answer) {
            sendUserError(error, res);
            return;
          }
          res.json(answer);
        });
    });
});
