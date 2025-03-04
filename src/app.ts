//! src/app.ts

import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import tasksRoutes from "./routes/tasks.routes";
import connectDB from "./config/database";
import swaggerSpec from "./config/swagger.config";
import swaggerUi from "swagger-ui-express";

// Load environment variables
dotenv.config();

const app: Application = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Connect to the database (skip connection if in test mode)
if (process.env.NODE_ENV !== "test") {
  connectDB();
}

// Mount API routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", tasksRoutes);

// Swagger API documentation available at http://localhost:3000/api-docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Global error handling middleware
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ message: "Internal Server Error" });
});

// Start the server only if not in test mode
if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
