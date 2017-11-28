const colors = require('colors');

const logger = require('tracer').colorConsole({
  format: '>>>>>>>>>>>>>>>>>>> {{title}} {{message}} (in {{file}}:{{line}})',
  dateformat: 'HH:MM:ss.L',
  level: 'warn',
  stackIndex: 1
});
const catchLogger = require('tracer').colorConsole({
  format: '<<<<<<<<<<<<<<<<<{{title}} {{message}} (in {{file}}:{{line}})>>>>>>>>>>>>>>',
  dateformat: 'HH:MM:ss.L',
  level: 'warn',
  stackIndex: 1,
  filters: [colors.underline, colors.yellow],
});

const log = (str) => {
  logger.info(str);
};
const catchLog = (str) => {
  catchLogger.info(str);
};
module.exports = { log, catchLog };
