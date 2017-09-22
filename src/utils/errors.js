const newError = (status, message) => ({
  error: {
    status,
    message
  }
});

const resError = (error, res) => {
  res.status(error.status).json({ error });
};

module.exports = {
  newError,
  resError
};
