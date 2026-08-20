import express from "express";
import {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
} from "../controllers/project.controller";
import { protect } from "../middlewares/auth.middleware";

const router = express.Router();

router.use(protect);

router.route("/").post(createProject).get(getProjects);

router.route("/:id").put(updateProject).delete(deleteProject);

export default router;
