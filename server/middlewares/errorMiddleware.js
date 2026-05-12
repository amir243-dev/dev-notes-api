require("dotenv").config();

const errorHandler = (err, req, res, next) => {
  // 1. Determine the Status Code
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  //   2. Set the Status
  res.status(statusCode);

  //   3. send over the json response back to the backend.
  res.json({
    success: false,
    message: err.message,
    // stack: shows exactly which line of code broke,
    // but only if we are in production mode!
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

module.exports = { errorHandler };
