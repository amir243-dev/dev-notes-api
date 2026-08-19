import express from "express";
import { registerUser, loginUser, getMe } from "../controllers/user.controller";
import { protect } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);

export default router;
