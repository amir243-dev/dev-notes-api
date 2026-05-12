const mongoose = require("mongoose");
const express = require("express");
const bycryptjs = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a new name"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Please add a new email"],
      lowercase: true,
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Please add a new password"],
      minLength: [true, "Password must be at least 6 characters"],
    },
  },

  { timestamps: true },
);

// =========================================
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bycryptjs.compare(enteredPassword, this.password);
};

// =============================================================

// ==============================================================
userSchema.pre("save", async function (next) {
  // Only hash when password is new or modified
  if (!this.isModified("password")) {
    return next;
  }

  // Generate a salt with it.
  const salt = await bycryptjs.genSalt(10);
  this.password = await bycryptjs.hash(this.password, salt);
  next;
});

userSchema.pre("remove", async function (next) {
  if (this.isDeleted(userSchema)) {
    return next;
  }
});

// ==============================
module.exports = mongoose.model("User", userSchema);
