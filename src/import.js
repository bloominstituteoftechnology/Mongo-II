const fs = require('fs');

const importJson = () => {
  const contents = fs.readFileSync('c:\\temp\\systemFunctions.json', 'utf8');
  // const fixed = contents.replace(/(\\n)/g, '\n');
  const fixed = contents.replace(/(\\r)/g, '\r');
  fs.writeFileSync('c:\\temp\\fixedSystemFunctions.json', fixed);
};
importJson();
