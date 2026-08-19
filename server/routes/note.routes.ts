import express from "express";
import {
  createNote,
  getNotes,
  updateNote,
  deleteNote,
} from "../controllers/note.controller";
import { protect } from "../middlewares/auth.middleware";

const router = express.Router();

router.use(protect); // All note routes require auth

router.route("/").post(createNote).get(getNotes);

router.route("/:id").put(updateNote).delete(deleteNote);

export default router;
