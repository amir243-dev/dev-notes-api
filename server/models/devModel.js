const mongoose = require("mongoose");

const devNotes = new mongoose.Schema({
  title: String,

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
