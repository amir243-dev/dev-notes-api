const express = require("express");
const {
  createDevNote,
  allDevNotes,
  updateDevNote,
  deleteDevNote,
} = require("../controllers/devController");

const router = express.Router();

router.post("/", createDevNote);
router.get("/all", allDevNotes);
router.patch("/update/:id", updateDevNote);
router.delete("/delete/:id", deleteDevNote);

module.exports = router;
