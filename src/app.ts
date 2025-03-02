import express, { Application } from "express";
import dotenv from "dotenv";

dotenv.config();

const app: Application = express();

app.use(express.json());

//! Rutas
app.get("/", (_req, res) => {
    res.json({ message: "Test route" });
});

export default app;
