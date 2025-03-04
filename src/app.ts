import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import tasksRoutes from "./routes/tasks.routes";
import connectDB from "./config/database";

// Carga las variables de entorno (no sobrescribe si ya existen)
dotenv.config();

const app: Application = express();

app.use(express.json());
app.use(cors());

// Si no estamos en entorno de test, conectamos a la DB (en tests se hace manualmente)
if (process.env.NODE_ENV !== "test") {
  connectDB();
}

// Montamos las rutas
app.use("/api/auth", authRoutes);
app.use("/api/tasks", tasksRoutes);

// Middleware de manejo de errores global (opcional)
app.use(
  (
    err: any,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
);

export default app;
