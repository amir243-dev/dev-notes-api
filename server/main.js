// THE REQUIREMENTS OF A SERVER IN RESPECTIVE VARIABLES.
const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const devRoute = require("./routes/devRoute");
const userRoute = require("./routes/userRoute");

// A GLOBAL ERROR MIDDLEWARE THAT SERVES AS A NET, NOT A GATE-KEEP.
const { errorHandler } = require("./middlewares/errorMiddleware");

// THE INITIALIZATION OF EXPRESS.JS AND THE PORT
const main = express();
const port = process.env.PORT || 3000;

// THE USAGE OF EXPRESS IN THE SERVER RESPONSES =>> THE MIDDLEWARE
main.use(cors());
main.use(express.json());

// THE "ROUTE" MIDDLEWARE
main.use("/api/notes", devRoute);
main.use("/api/auth", userRoute);
main.use(errorHandler);

// HEALTH CHECK ON POSTMAN/CHROME LOCALHOST
main.get("/health", (req, res) => {
  res.status(200).json({
    status: "up",
    message: "Server is healthy and running",
    timestamp: new Date().toISOString(),
  });
});

// INITIALIZE THE DB IN AN ASYNC AWAIT FUNCTION
const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Dev Notes is running smoothly");

    main.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
