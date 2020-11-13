const path = require('path');
const fs = require('fs');

const winston = require('winston');
// require('winston-daily-rotate-file');

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

  const dirname = path.resolve(__dirname, 'logs/')
  const filename = `${level}.%DATE%`
  const auditFile = path.resolve(__dirname, `logs/audits/audit.${level}.json`)

  const transport = new winston.transports.DailyRotateFile({
    dirname,
    filename,
    extension: '.log',
    auditFile,
    level,
    maxSize: '20m', // 20MB
    zippedArchive: true,
    format: format.combine(filter(), fileFormat)
  });

  transport.on('rotate', (oldFilename, newFilename) => {
    const formatFileName = (name) => {
      name = name.split('/');
      return name[name.length - 1];
    };

    const newFile = formatFileName(newFilename);
    const oldFile = formatFileName(oldFilename);
    const date = new Date().toLocaleDateString();

    const fileEvents = fs.createWriteStream(
      path.resolve(__dirname, `logs/logFileEvents.log`),
      { flags: 'a' }
    );

    fileEvents.write(`{"File archived": "${oldFile}", "date": "${date}"}\n`);
    fileEvents.write(`{"File created": "${newFile}", "date": "${date}"}\n`);
    fileEvents.end();

    logger.silly(`New [ ${newFile} ] - 📰 Hot off the press! 📰`);
    logger.silly(`Zipped [ ${oldFile} ] - 🔒 Locked for safe keeping! 🔒`);
  });

  logger.add(transport);
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
