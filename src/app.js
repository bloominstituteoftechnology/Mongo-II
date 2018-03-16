const mongoose = require('mongoose');
// Do NOT modify this file; make your changes in server.js.
const { server } = require('./server.js');

mongoose
  .connect('mongodb://localhost/so-posts')
  .then(() => {
    server.listen(3000, () => console.log('API Server running on port 3000, Mongo connected'));
  })
  .catch(error => {
    console.error('database connection failed');
  });
