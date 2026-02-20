const express = require("express");
const {
  createDevNote,
  allDevNotes,
  updateDevNote,
} = require("../controllers/devController");

const router = express.Router();

router.post("/", createDevNote);
router.get("/all", allDevNotes);
router.patch("/update/:id", updateDevNote);

module.exports = router;
