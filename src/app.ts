import express, { Application } from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import tasksRoutes from "./routes/tasks.routes"
import connectDB from "./config/database";

dotenv.config();

const app: Application = express();

//! Middlewares globales
app.use(express.json());

//! Conectamos a la DB
// Condicional: Si no estamos en entorno de test, conectamos a la DB
if (process.env.NODE_ENV !== "test") {
  connectDB();
}

//! Montamos las Rutas
app.use("/api/auth", authRoutes);
app.use("/api/tasks", tasksRoutes);

export default app;
