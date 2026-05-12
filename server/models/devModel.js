const mongoose = require("mongoose");

const devNotes = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User", // This must match the name you gave your User model
  },
  title: {
    type: String,
    required: true,
  },

  note: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("DevModel", devNotes);
