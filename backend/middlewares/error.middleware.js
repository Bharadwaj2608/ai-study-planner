export function notFound(req, res, next) {
  res.status(404).json({ message: `Not found - ${req.originalUrl}` });
}

export function errorHandler(err, req, res, _next) {
  console.error("🔥 Error:", err);
  const status = err.status || res.statusCode === 200 ? 500 : res.statusCode;
  res.status(status).json({
    message: err.message || "Server error",
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
}
