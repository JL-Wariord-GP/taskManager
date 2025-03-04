import { Router} from "express";
import { register, login, verifyUser } from "../controllers/auth.controller";
import { validateRegister } from "../middleware/validate.register.middleware";
import { validateLogin } from "../middleware/validate.login.middleware";
import { validationError } from "../middleware/validation.error.middleware";


const router = Router();


router.post("/register", validateRegister, validationError, register);
router.post("/login", validateLogin, validationError, login);
router.get("/verify", verifyUser);

export default router;
