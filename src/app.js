// Do NOT modify this file; make your changes in server.js.
const { server } = require('./server.js');

const PORT = process.env.PORT || 3000;

server.listen(PORT);
// eslint-disable-next-line no-console
console.log(`Server running at http://localhost:${PORT}/`);
