const express = require("express");
const {
  createDevNote,
  allDevNotes,
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
router.patch("/update/:id", noteValidationRules, validation, updateDevNote);
router.delete("/delete/:id", deleteDevNote);

module.exports = router;
