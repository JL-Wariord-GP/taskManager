import { Router } from "express";
import { createTask } from "../controllers/tasks.controller";


const router= Router();

router.post("/", createTask);

export default router;