function errorHandler(error, _request, response, _next) {
  console.error(error);
  const status = error.status || 500;
  response.status(status).json({ error: error.message || 'Internal server error' });
}

module.exports = errorHandler;