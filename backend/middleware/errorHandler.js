const errorHandler = (err, req, res, next) => {
  console.error(err.stack || err);
  const msg = err.sqlMessage || err.message || 'Internal Server Error';
  res.status(err.status || 500).json({
    success: false,
    message: msg,
    ...(err.code && { code: err.code }),
  });
};

module.exports = errorHandler;
