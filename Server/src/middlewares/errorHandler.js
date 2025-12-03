const logger = require('../utils/logger');

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  logger.error(err);

  const status = err.status || err.statusCode || 500;
  const response = {
    message: err.message || 'Internal Server Error'
  };

  if (process.env.NODE_ENV !== 'production' && err.stack) {
    response.stack = err.stack;
  }

  res.status(status).json(response);
}

module.exports = errorHandler;

