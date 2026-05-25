import { Router } from "express";
import authRoutes from "./auth.routes";
import employeeRoutes from "./employee.routes";
import analyticsRoutes from "./analytics.routes";

const router = Router();

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
