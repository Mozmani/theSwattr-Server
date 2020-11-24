require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  CORS_ORIGIN_DEV:
    process.env.CORS_ORIGIN_DEV || 'http://localhost:3000',
  CORS_ORIGIN_PROD: process.env.CORS_ORIGIN_PROD,
  API_TOKEN: process.env.API_TOKEN,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRY: process.env.JWT_EXPIRY || '2m',
  SALT_ROUNDS: +process.env.SALT_ROUNDS,
  DEV_SECRET: process.env.DEV_SECRET,
  DATABASE_URL: process.env.DATABASE_URL,
  TEST_DB_URL: process.env.TEST_DB_URL,
};
