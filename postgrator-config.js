const { NODE_ENV, TEST_DB_URL, DATABASE_URL } = require('./src/config');

module.exports = {
  migrationDirectory: __dirname + '/db/migrations',
  driver: 'pg',
  connectionString: NODE_ENV === 'test' ? TEST_DB_URL : DATABASE_URL
};
