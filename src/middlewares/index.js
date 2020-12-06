const auth = require('./auth');
const validate = require('./body-validators');
const error = require('./error-handlers');
const { app, Router, jsonBodyParser } = require('./express-methods');

//exports middlewares
module.exports = {
  auth,
  validate,
  error,
  app,
  Router,
  jsonBodyParser,
};
