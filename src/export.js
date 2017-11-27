const fs = require('fs');

const exportJson = () => {
  const contents = fs.readFileSync('c:\\temp\\fixedSystemFunctions.json', 'utf8');
  // const fixed = contents.replace(/(\n)/g, '\\n');
  const fixed = contents.replace(/(\r)/g, '\\r');
  fs.writeFileSync('c:\\temp\\fixed.json', fixed);
};
exportJson();
