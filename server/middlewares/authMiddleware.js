const jwt = require("jsonwebtoken");
const { asyncHandler } = require("../utils/asyncHandler");
const User = require("../models/user.model");

const gatekeeper = asyncHandler(async (req, res, next) => {
  let token;

  // 1. Check if the header exists and starts with "Bearer"

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // 2. Get the token from the header (split "Bearer <token>")
    try {
      token = req.headers.authorization.split(" ")[1];

      // 3. Verify the token
      const decoded = jwt.verify(token, process.env.JWT_KEY);

      // 4. Attach the user to the request object (minus the password)
      // This is the "Magic" step!
      req.user = await User.findById(decoded.id).select("-password");

      return next(); // Move on to the controller
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("No authorization, no token provided");
  }
});

module.exports = { gatekeeper };
