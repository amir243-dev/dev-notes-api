const { default: mongoose } = require("mongoose");
const devModel = require("../models/devModel");

const createDevNote = async (req, res) => {
  try {
    const { title, note } = req.body;
    // VALIDATION OF THE POST REQUEST IN AN "IF" STATEMENT
    if (!title || !note) {
      return res.status(400).json({ message: "Error" });
    }

    // CHECK FOR EXISTING NOTES

    const checkExistingNotes = await devModel.findOne({ title });

    if (checkExistingNotes) {
      return res.status(400).json({ Message: "Title Found" });
    }
    // VALIDATED? THEN CREATE.
    const devNote = await devModel.create({ title, note });
    res.status(201).json(devNote);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

// ========================================================

const allDevNotes = async (req, res) => {
  try {
    const notes = await devModel.find();
    if (!notes) {
      return res.status(400).json({ message: "Notes Not Found" });
    }
    res.status(200).json({ message: "Here is/are your note(s)", data: notes });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

// ========================================================

const updateDevNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, note } = req.body;

    const updatedNotes = await devModel.findByIdAndUpdate(
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

    if (!updatedNotes) {
      return res.status(404).json({ message: "Note not Found" });
    }
    res.status(200).json({
      message: "Note has been updated",
      success: true,
      data: updatedNotes,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

// ====================================================

const deleteDevNote = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedNote = await devModel.findByIdAndDelete(id);

    if (!deletedNote) {
      return res.status(404).json({ message: "Note not Found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Note deleted Successfully" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

// =====================================================

module.exports = { createDevNote, allDevNotes, updateDevNote, deleteDevNote };
