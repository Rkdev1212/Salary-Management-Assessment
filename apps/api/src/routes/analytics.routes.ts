import { Router } from "express";
import { AnalyticsController } from "../controllers/analytics.controller";
import { authenticate } from "../middleware/auth";

const router: Router = Router();
const controller = new AnalyticsController();

// All routes require authentication
router.use(authenticate);

/**
 * @openapi
 * /analytics/dashboard:
 *   get:
 *     summary: Dashboard analytics
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
router.get("/dashboard", controller.getDashboard);
router.get("/country-salary-stats", controller.getCountrySalaryStats);
router.get("/job-title-salary-stats", controller.getJobTitleSalaryStats);
router.get("/department-stats", controller.getDepartmentStats);

export default router;
