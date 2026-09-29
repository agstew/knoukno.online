// Centralized error handler - keeps internals out of client responses
export function errorHandler(err, _req, res, _next) {
  console.error(err);
  const status = err.status || 500;
  const message = status === 500 ? "Internal server error" : err.message;
  res.status(status).json({ error: message });
}

export function notFound(_req, res) {
  res.status(404).json({ error: "Not found" });
}
