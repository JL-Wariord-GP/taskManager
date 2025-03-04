import { Router } from "express";
import {login, register, verifyUser } from "../controllers/auth.controller";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/verify", verifyUser);
export default router;
