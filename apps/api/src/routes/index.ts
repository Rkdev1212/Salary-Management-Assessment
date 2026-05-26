import { Router } from "express";
import analyticsRoutes from "./analytics.routes";
import authRoutes from "./auth.routes";
import employeeRoutes from "./employee.routes";

const router: Router = Router();

router.get("/health", (_req, res) => {
	res.json({
		success: true,
		message: "API is healthy",
		timestamp: new Date().toISOString(),
	});
});

router.use("/auth", authRoutes);
router.use("/employees", employeeRoutes);
router.use("/analytics", analyticsRoutes);

export default router;
