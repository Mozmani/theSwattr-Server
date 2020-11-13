const { NODE_ENV } = require('../config');

const errorTypes = {
  ValidationError: 422,
  UniqueViolationError: 409
};

const errorMessages = {
  UniqueViolationError: 'Already exists.'
};

const notFound = (req, res, next) => {
  const error = new Error(`Not found - ${req.originalUrl}`);

  res.status(404);
  next(error);
};

const errorHandler = (error, req, res, next) => {
  const statusCode =
    res.statusCode === 200 ? errorTypes[error.name] || 500 : res.statusCode;

  res.status(statusCode).json({
    status: statusCode,
    message: errorMessages[error.name] || error.message,
    stack: NODE_ENV === 'production' ? '🥞' : error.stack,
    errors: error.errors || undefined
  });
};

module.exports = {
  notFound,
  errorHandler
};
