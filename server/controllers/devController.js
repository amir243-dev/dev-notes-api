const devModel = require("../models/devModel");
const { asyncHandler } = require("../utils/asyncHandler");
const { ApiResponse } = require("../utils/apiResponse");

// =========================================================
// THE CONTROLLERS
// =========================================================

const createDevNote = asyncHandler(async (req, res) => {
  const { title, note } = req.body;

  // CHECK FOR EXISTING NOTES= MANUAL RESULT-CHECK.
  const checkExistingNotes = await devModel.findOne({ title });

  if (checkExistingNotes) {
    return res.status(400).json({ Message: "Title Found" });
  }
  // VALIDATED? THEN CREATE.
  const devNote = await devModel.create({ title, note });
  res
    .status(201)
    .json(new ApiResponse(201, devNote, "Note created Successfully"));
});

// ========================================================

const allDevNotes = asyncHandler(async (req, res, next) => {
  const notes = await devModel.find();

  if (!notes) {
    return res.status(400).json({ message: "Notes Not Found" });
  }
  res
    .status(200)
    .json(new ApiResponse(200, notes, "Notes retrieved successfully"));
});

// ========================================================

const updateDevNote = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, note } = req.body;

  const updatedNote = await devModel.findByIdAndUpdate(
    id,
    {
      title,
      note,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!updatedNote) {
    return res.status(404).json({ message: "Note not Found" });
  }
  res
    .status(200)
    .json(new ApiResponse(200, updatedNotes, "Notes Updated Successfully"));
});

// ====================================================

const deleteDevNote = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const deletedNote = await devModel.findByIdAndDelete(id);

  if (!deletedNote) {
    return res.status(404).json({ message: "Note not Found" });
  }

  res
    .status(200)
    .json(new ApiResponse(200, deletedNote, "Notes deleted Successfully"));
});

// =====================================================

module.exports = { createDevNote, allDevNotes, updateDevNote, deleteDevNote };
