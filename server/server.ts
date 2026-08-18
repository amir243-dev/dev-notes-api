import express, { Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

// Keep require() for local .js files until we migrate them in Days 2-3
const devRoute = require("./routes/devRoute");
const userRoute = require("./routes/userRoute");
const { errorHandler } = require("./middlewares/errorMiddleware");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/notes", devRoute);
app.use("/api/auth", userRoute);

// Health check
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "up",
    message: "Server is up and running",
    timestamp: new Date().toISOString(),
  });
});

// Error handler after routes
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
