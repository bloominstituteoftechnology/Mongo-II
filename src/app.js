// Do NOT modify this file; make your changes in server.js.
const mongoose = require('mongoose');
const { server } = require('./server.js');
const dbConnect = require('./utils/dbConnect');

const port = process.env.PORT || 3000;

/* eslint no-console: 0 */
dbConnect.then(() => {
  server.listen(port);
  console.log(`Server and Database Listening on ${port}`);
}, (err) => {
  console.log('\n************************');
  console.log("ERROR: Couldn't connect to MongoDB. Do you have it running?");
  console.log('************************\n');
});
