const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');

const server = express();

server.use(bodyParser.json());
server.use('/', routes);

module.exports = { server };
