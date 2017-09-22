const bodyParser = require('body-parser');
const express = require('express');

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());

// TODO: write your route handlers here

const postRoutes = require('./routes/postRoutes');

postRoutes(server);

module.exports = { server };
