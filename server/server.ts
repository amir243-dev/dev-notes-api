import express, { Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import { notFound, errorHandler } from "./middlewares/error.middleware";
import userRoutes from "./routes/user.routes";
import noteRoutes from "./routes/note.routes";
import projectRoutes from "./routes/project.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
// ===================
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: "Too many login attempts, retry after 15 minutes" },
});
// ==================
app.use("/api/notes", noteRoutes);
app.use("/api/auth", userRoutes);
app.use("/api/projects", projectRoutes);

// Health check
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "up",
    message: "Server is up and running",
    timestamp: new Date().toISOString(),
  });
});

// Error handler after routes
app.use(notFound);
app.use(errorHandler);

const start = async (): Promise<void> => {
  try {
    const MONGO_URL = process.env.MONGO_URL;
    if (!MONGO_URL) {
      throw new Error(
        "MONGO_URL is not clearly defined in environment variables",
      );
    }
    await mongoose.connect(MONGO_URL);
    console.log("Dev Notes is running smoothly");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
start();
