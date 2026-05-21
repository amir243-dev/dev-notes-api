const express = require("express");
const {
  createDevNote,
  allDevNotes,
  getNoteStats,
  updateDevNote,
  deleteDevNote,
} = require("../controllers/devController");
const { noteValidationRules } = require("../validators/noteValidator");
const { validation } = require("../middlewares/validationMiddleware");
const { gatekeeper } = require("../middlewares/authMiddleware");

const router = express.Router();
router.use(gatekeeper);

router.post("/", noteValidationRules, validation, createDevNote);
router.get("/all", allDevNotes);
router.get("/stats", getNoteStats);
router.patch("/update/:id", noteValidationRules, validation, updateDevNote);
router.delete("/delete/:id", deleteDevNote);

module.exports = router;
