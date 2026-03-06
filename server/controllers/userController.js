const user = require("../models/userModel");
const { ApiResponse } = require("../utils/apiResponse");
const { asyncHandler } = require("../utils/asyncHandler");

// =================THE CONTROLLERS==========================

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await user.findOne({ email });
  if (userExists) {
    return res.status(400).json({ Message: "User already exists" });
  }

  const newUser = await user.create({
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
    res.status(400).json({ Message: "Invalid user data" });
  }
});

// ====================================================
module.exports = { registerUser };
