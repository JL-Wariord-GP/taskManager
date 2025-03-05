//! src/app.ts

import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import tasksRoutes from "./routes/tasks.routes";
import connectDB from "./config/database";
import { errorHandler } from "./middleware/error.handler.middleware";

//! Load environment variables from .env file
dotenv.config();

const app: Application = express();

//! Global Middlewares
app.use(express.json());
app.use(cors());

//! API Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", tasksRoutes);

//! Global Error Handling Middleware
app.use(errorHandler);

//! Connect to the database only if not in test mode
if (process.env.NODE_ENV !== "test") {
  connectDB();
}

export default app;
