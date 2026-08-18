const User = require("../models/user.model").default;
const { ApiResponse } = require("../utils/apiResponse");
const { asyncHandler } = require("../utils/asyncHandler");
const { generateToken } = require("../utils/generateToken");

// =================THE CONTROLLERS==========================

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const newUser = await User.create({
    name,
    email,
    password,
  });

  if (newUser) {
    res.status(200).json(
      new ApiResponse(
        201,
        {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          password: newUser.password,
        },
        "User registered successfully",
      ),
    );
  } else {
    throw new Error("Registration unsuccessful");
  }
});

// ====================================================

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // Find the User by Email
  const foundUser = await User.findOne({ email });
  if (foundUser && (await foundUser.matchPassword(password))) {
    res.status(200).json(
      new ApiResponse(
        200,
        {
          _id: foundUser._id,
          name: foundUser.name,
          email: foundUser.email,
          token: generateToken(foundUser._id),
        },
        "Login successful",
      ),
    );
  } else {
    res.status(401);
    throw new Error("Invalid Email & Password");
  }
});

// ====================================================
const getUserProfile = asyncHandler(async (req, res) => {
  // our req.user was populated by the gatekeeper middleware

  const userProfile = await User.findById(req.user._id);

  if (userProfile) {
    res.status(200).json(
      new ApiResponse(
        200,
        {
          _id: userProfile._id,
          name: userProfile.name,
          email: userProfile.email,
        },
        "User Profile retrieved",
      ),
    );
  } else {
    res.status(404);
    throw new Error();
  }
});

// ====================================================
module.exports = { registerUser, loginUser, getUserProfile };
