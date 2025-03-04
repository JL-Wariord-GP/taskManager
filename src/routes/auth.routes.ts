//! src/routes/auth.routes.ts

import { Router } from "express";
import { register, login, verifyUser } from "../controllers/auth.controller";
import { validateRegister } from "../middleware/validate.register.middleware";
import { validateLogin } from "../middleware/validate.login.middleware";
import { validationError } from "../middleware/validation.error.middleware";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     UserRegister:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The user's full name.
 *         email:
 *           type: string
 *           description: The user's email address.
 *         password:
 *           type: string
 *           description: The user's password.
 *       required:
 *         - name
 *         - email
 *         - password
 *
 *     UserLogin:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           description: The user's email address.
 *         password:
 *           type: string
 *           description: The user's password.
 *       required:
 *         - email
 *         - password
 *
 * tags:
 *   - name: Auth
 *     description: API endpoints for user authentication
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       description: User object to be registered
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRegister'
 *     responses:
 *       201:
 *         description: User registered successfully.
 *       400:
 *         description: Validation error or user already exists.
 */
router.post("/register", validateRegister, validationError, register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Auth]
 *     requestBody:
 *       description: User login credentials
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLogin'
 *     responses:
 *       200:
 *         description: User logged in successfully.
 *       400:
 *         description: Invalid credentials.
 */
router.post("/login", validateLogin, validationError, login);

/**
 * @swagger
 * /api/auth/verify:
 *   get:
 *     summary: Verify a user's email address
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Verification token sent to the user's email.
 *     responses:
 *       200:
 *         description: Email verified successfully.
 *       400:
 *         description: Invalid or expired token.
 */
router.get("/verify", verifyUser);

export default router;
