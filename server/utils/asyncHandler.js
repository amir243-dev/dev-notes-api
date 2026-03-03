const asyncHandler = (fn) => (req, res, next) => {
  // We resolve the function as a Promise.
  // If it fails, .catch(next) automatically sends it to your error middleware.
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = { asyncHandler };
