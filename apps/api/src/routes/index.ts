import { Router } from "express";
import { AnalyticsController } from "../controllers/analytics.controller";
import analyticsRoutes from "./analytics.routes";
import authRoutes from "./auth.routes";
import employeeRoutes from "./employee.routes";

const router: Router = Router();
const analyticsController = new AnalyticsController();

/**
 * @openapi
 * /health:
 *   get:
 *     summary: Health check
 *     description: Returns the health status of the API.
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
router.get("/health", (_req, res) => {
	res.json({
		success: true,
		message: "API is healthy",
		timestamp: new Date().toISOString(),
	});
});

router.use("/auth", authRoutes);
router.use("/employees", employeeRoutes);
// Alias route for dashboard without /analytics prefix
/**
 * @openapi
 * /dashboard:
 *   get:
 *     summary: Dashboard analytics (alias)
 *     tags:
 *       - Analytics
 *     responses:
 *       200:
 *         description: Dashboard data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AnalyticsDashboard"
 */
router.get("/dashboard", analyticsController.getDashboard);
router.use("/analytics", analyticsRoutes);

export default router;
