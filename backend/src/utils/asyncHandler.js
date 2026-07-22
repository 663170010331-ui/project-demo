// Wraps async route handlers so rejected promises reach Express's error
// middleware instead of crashing the process (Express 4 doesn't do this automatically).
export const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)
