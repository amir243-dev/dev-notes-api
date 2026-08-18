const Note = require("../models/note.model");
const { asyncHandler } = require("../utils/asyncHandler");
const { ApiResponse } = require("../utils/apiResponse");

// =========================================================
// THE CONTROLLERS
// =========================================================

const createDevNote = asyncHandler(async (req, res) => {
  const { title, note } = req.body;

  // CHECK FOR EXISTING NOTES= MANUAL RESULT-CHECK.
  const checkExistingNotes = await Note.findOne({ title });

  if (checkExistingNotes) {
    return res.status(400).json({ Message: "Title Found" });
  }
  // VALIDATED? THEN CREATE.
  const devNote = await Note.create({ title, note, user: req.user._id });
  res
    .status(201)
    .json(new ApiResponse(201, devNote, "Note created Successfully"));
});

// ========================================================

const allDevNotes = asyncHandler(async (req, res) => {
  /**
   * LAYER 1: THE INPUTS (What does the user want?)
   * We grab strings from the URL and turn them into logic.
   */
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Search: If 'search' exists in URL, create a Regex. If not, ignore it.
  const searchFilter = req.query.search
    ? { title: { $regex: req.query.search, $options: "i" } }
    : {};

  // Sort: Turn "title,createdAt" into "title createdAt" for Mongoose
  const sortBy = req.query.sort
    ? req.query.sort.split(",").join(" ")
    : "-createdAt";

  /**
   * LAYER 2: THE QUERY (Talking to MongoDB)
   * We combine 'Ownership' + 'Search' into one filter.
   */
  const finalQuery = {
    user: req.user.id,
    ...searchFilter,
  };

  // The Chain: Find it -> Sort it -> Skip some -> Limit some
  const notes = await Note.find(finalQuery)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .populate("user", "name email");

  /**
   * LAYER 3: THE METADATA (Calculating the "Map")
   * We need to tell the frontend how much more data exists.
   */
  const totalNotes = await Note.countDocuments(finalQuery);
  const totalPages = Math.ceil(totalNotes / limit);

  // Send the response using your ApiResponse class
  res.status(200).json(
    new ApiResponse(
      200,
      {
        notes,
        meta: {
          totalNotes,
          totalPages,
          currentPage: page,
          limit,
        },
      },
      "Data retrieved successfully",
    ),
  );
});

// ========================================================
const getNoteStats = asyncHandler(async (req, res) => {
  const stats = await Note.aggregate([
    // STAGE 1: Filter - only look at notes belonging to the current user
    { $match: { user: req.user._id } },

    // STAGE 2: Transform - group the data and perform the calculation
    {
      $group: {
        _id: null, // We want one result for everything, not grouped by a category
        totalNotes: { $sum: 1 }, // Count every document that passed the $match
        avgContentLength: { $avg: { $strLenCP: "$note" } }, // Bonus: how long are the notes?
      },
    },
  ]);
  // If the user has zero notes, stats will be an empty array [].
  // We handle that gracefully.
  const result =
    (await stats).length > 0
      ? stats[0]
      : { totalNotes: 0, avgContentLength: 0 };

  res
    .status(200)
    .json(new ApiResponse(200, result, "Stats retrieved successfully"));
});
// ========================================================

const updateDevNote = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, note } = req.body;

  const updateNote = await Note.findById(id);

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

  const deleteNote = await Note.findById(id);

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

module.exports = {
  createDevNote,
  allDevNotes,
  getNoteStats,
  updateDevNote,
  deleteDevNote,
};
