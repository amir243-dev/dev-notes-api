import express from "express";
import {
  createNote,
  getNotes,
  updateNote,
  deleteNote,
  getStats,
} from "../controllers/note.controller";
import { protect } from "../middlewares/auth.middleware";

const router = express.Router();

router.use(protect); // All note routes require auth

router.route("/").post(createNote).get(getNotes);
router.get("/stats", getStats);

router.route("/:id").put(updateNote).delete(deleteNote);

export default router;
