import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { validateBody } from "../middleware/validate";
import { authenticate } from "../middleware/auth";
import {
	registerSchema,
	loginSchema,
	refreshTokenSchema,
} from "../validators/auth.validator";

const router = Router();
const controller = new AuthController();

router.post("/register", validateBody(registerSchema), controller.register);
router.post("/login", validateBody(loginSchema), controller.login);
router.post(
	"/refresh",
	validateBody(refreshTokenSchema),
	controller.refreshToken,
);
router.post("/logout", authenticate, controller.logout);
router.get("/me", authenticate, controller.me);

export default router;
