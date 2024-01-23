import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import morgan from "morgan";
import cors from "cors";

import dbConnect from "./Utils/dbConnect.js";

// dotenv config
dotenv.config();


// MongoDb Connection
dbConnect()


// rest object
const app = express(); // Instantition

// Middlewares

app.use(cors());
app.use(express.json()); // Body Parser
app.use(morgan("dev"));
// Port
const PORT = process.env.PORT || 5000;

// Routes
// 1.test Router
app.get("/", (req, res) => {
  res.status(200).json({ success: "Hello there" });
});

// listen
app.listen(PORT, () => {
  console.log(`Node Server Running in ${process.env.DEV_MODE} Mode On port ${process.env.PORT}`.bgBlue.black.bold);
});
