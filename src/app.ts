import express, { Application } from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import connectDB from "./config/database";

dotenv.config();

const app: Application = express();

//! Middlewares globales
app.use(express.json());

//! Conectamos a la DB
connectDB();

//! Montamos las Rutas
app.use("/api/auth", authRoutes);

export default app;
