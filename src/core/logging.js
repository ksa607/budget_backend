
const winston = require('winston');

const logger = winston.createLogger({
  level: 'silly',
  format: winston.format.simple(),
  transports: [
    new winston.transports.Console({silent: false})
  ]
});

module.exports.getLogger = () => logger;
