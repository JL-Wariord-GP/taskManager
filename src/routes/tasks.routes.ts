import { Router } from "express";
import { createTask, updateTask } from "../controllers/tasks.controller";

const router = Router();

router.post("/", createTask);
router.put("/:id", updateTask);

export default router;
