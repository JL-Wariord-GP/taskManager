import { Router } from "express";
import { createTask, deleteTask, updateTask } from "../controllers/tasks.controller";

const router = Router();

router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask)

export default router;
