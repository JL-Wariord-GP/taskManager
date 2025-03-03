import { Router } from "express";
import { createTask, deleteTask, getTask, getTasks, updateTask } from "../controllers/tasks.controller";

const router = Router();

router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask)

router.get("/:id", getTask);
router.get("/", getTasks);

export default router;
