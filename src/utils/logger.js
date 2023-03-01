const winston = require("winston");

const logConfiguration = {
  transports: [
      new winston.transports.File({
        level: 'error',
        // Create the log directory if it does not exist
        filename: 'logs/error.log'
    })
  ],
  format: winston.format.combine(
      winston.format.label({
          label: `Label🏷️`
      }),
      winston.format.timestamp({
         format: 'MMM-DD-YYYY HH:mm:ss'
     }),
      winston.format.printf(info => `${info.level}:  ${[info.timestamp]}: ${info.message}`),
  )
};

const logger = winston.createLogger(logConfiguration);
module.exports = logger
