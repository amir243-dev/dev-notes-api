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
  const devNote = await devModel.create({ title, note, user: req.user._id });
  res
    .status(201)
    .json(new ApiResponse(201, devNote, "Note created Successfully"));
});

// ========================================================

const allDevNotes = asyncHandler(async (req, res) => {
  // Get all limits and skips from the query string(set defaults if missing)
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 2;

  // calculate the "skip" math
  const skip = (page - 1) * limit;

  // Query the database with limit and skip applied
  const notes = await devModel
    .find({ user: req.user.id })
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  // Get the total count of notes for this user (so the frontend knows how many pages exist)
  const totalNotes = await devModel.countDocuments({ user: req.user.id });
  const totalPages = Math.ceil(totalNotes / limit);

  if (!notes) {
    return res.status(400).json({ message: "Notes Not Found" });
  }
  res.status(200).json(
    new ApiResponse(
      200,
      notes,
      {
        meta: {
          totalNotes,
          totalPages,
          currentPage: page,
          notesPerPage: limit,
        },
      },
      "Notes retrieved successfully",
    ),
  );
});

// ========================================================

const updateDevNote = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, note } = req.body;

  const updateNote = await devModel.findById(id);

  if (!updateNote) {
    res.status(404);
    throw new Error("Note not Found");
  }

  // 2. THE SECURITY CHECK: Does this note belong to the logged-in user?
  if (updateNote.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("Not authorized to update this note");
  }
  // 3. Update the fields and save
  updateNote.title = title || updateNote.title;
  updateNote.note = note || updateNote.note;

  const updatedNote = await updateNote.save();

  res
    .status(200)
    .json(new ApiResponse(200, updatedNote, "Notes Updated Successfully"));
});

// ====================================================

const deleteDevNote = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const deleteNote = await devModel.findById(id);

  if (!deleteNote) {
    res.status(404);
    throw new Error("Note not Found");
  }

  // SECURITY CHECK
  if (deleteNote.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("Not authorized to delete this note");
  }

  await deleteNote.deleteOne();

  res.status(200).json(new ApiResponse(200, {}, "Notes deleted Successfully"));
});

// =====================================================

module.exports = { createDevNote, allDevNotes, updateDevNote, deleteDevNote };
