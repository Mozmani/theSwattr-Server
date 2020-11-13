const path = require('path');

const winston = require('winston');

const { NODE_ENV } = require('../../src/config');

const { format } = winston

const fileFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.json()
);

const consoleFormat = format.combine(
  format.colorize({ colors: { info: 'blue' } }),
  format.timestamp({ format: 'HH:mm:ss' }),
  format.align(),
  format.printf(
    (info) => `[${info.timestamp}] ❗${info.level}: ${info.message}`
  )
);

const logger = winston.createLogger();
const levels = Object.keys(winston.config.npm.levels);

levels.forEach((level) => {
  // separates write files by level
  const filter = format((log) => (log.level === level ? log : false));

  const filename = path.resolve(__dirname, `logs/${level}.log`);

  logger.add(
    new winston.transports.File({
      filename,
      level,
      maxsize: 20000000, // 20MB
      tailable: true,
      zippedArchive: true,
      format: format.combine(filter(), fileFormat),
    })
  );
});

if (NODE_ENV === 'development') {
  logger.add(
    new winston.transports.Console({
      level: 'silly',
      format: consoleFormat
    })
  );
}

module.exports = logger;
