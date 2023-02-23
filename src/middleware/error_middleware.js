const error_middleware = (err, req, res, next) => {

  if (!err.cause)
  res.status(500).json({ error: err.message });
  else
  res.status(err.cause.status).json({ error: err.message });
}

module.exports =  error_middleware 