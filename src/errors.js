module.exports = {
  noAcceptedAnswer: {
    status: 404,
    message: 'Selected post has no accepted answer'
  },
  noPostWithId: {
    status: 404,
    message: 'Cannot find post with supplied ID'
  },
  serverError: {
    status: 500,
    message: 'Internal server error'
  }
}