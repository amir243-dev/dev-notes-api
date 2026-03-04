const mongoose = require("mongoose");
const express = require("express");

const userSchema = new mongoose.Schema({
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

  timestamps: true,
});
