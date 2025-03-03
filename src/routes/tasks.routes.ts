import { Router } from "express";
import {
  createTask,
  updateTask,
  deleteTask,
  getTask,
  getTasks,
} from "../controllers/tasks.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();

//! Aplicamos el middleware para proteger todas las rutas
router.use(protect);

//! Endpoints protegidos
router.post("/", createTask);
router.get("/:id", getTask);
router.get("/", getTasks);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;
