import { Router } from "express";
import { EmployeeController } from "../controllers/employee.controller";
import { authenticate } from "../middleware/auth";
import {
	validateBody,
	validateParams,
	validateQuery,
} from "../middleware/validate";
import {
	createEmployeeSchema,
	employeeFiltersSchema,
	idParamSchema,
	paginationSchema,
	updateEmployeeSchema,
} from "../validators/employee.validator";

const router: Router = Router();
const controller = new EmployeeController();

// All routes require authentication
router.use(authenticate);

/**
 * @openapi
 * /employees:
 *   get:
 *     summary: List employees
 *     tags:
 *       - Employees
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *       - in: query
 *         name: department
 *         schema:
 *           type: string
 *         description: Filter by department
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, INACTIVE]
 *         description: Filter by employment status
 *     responses:
 *       200:
 *         description: Paginated list of employees
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/EmployeePaginatedResponse"
 */
router.get(
	"/",
	validateQuery(paginationSchema.merge(employeeFiltersSchema)),
	controller.findAll,
);
/**
 * @openapi
 * /employees/filters:
 *   get:
 *     summary: Employee filter values
 *     tags:
 *       - Employees
 *     responses:
 *       200:
 *         description: Filter options for employees
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/EmployeeFilters"
 */
router.get("/filters", controller.getFilters);
/**
 * @openapi
 * /employees/{id}:
 *   get:
 *     summary: Get employee by ID
 *     tags:
 *       - Employees
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Employee UUID
 *     responses:
 *       200:
 *         description: Employee details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Employee"
 *       404:
 *         description: Employee not found
 */
router.get("/:id", validateParams(idParamSchema), controller.findById);

/**
 * @openapi
 * /employees:
 *   post:
 *     summary: Create a new employee
 *     tags:
 *       - Employees
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               department:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, INACTIVE]
 *     responses:
 *       201:
 *         description: Employee created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 firstName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *                 email:
 *                   type: string
 *                 department:
 *                   type: string
 *                 status:
 *                   type: string
 *       400:
 *         description: Validation error
 */
router.post("/", validateBody(createEmployeeSchema), controller.create);
/**
 * @openapi
 * /employees/{id}:
 *   put:
 *     summary: Update an employee
 *     tags:
 *       - Employees
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Employee UUID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/UpdateEmployeeDto"
 *     responses:
 *       200:
 *         description: Employee updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Employee"
 *       400:
 *         description: Validation error
 *       404:
 *         description: Employee not found
 */
router.put(
	"/:id",
	validateParams(idParamSchema),
	validateBody(updateEmployeeSchema),
	controller.update,
);
/**
 * @openapi
 * /employees/{id}:
 *   delete:
 *     summary: Delete an employee
 *     tags:
 *       - Employees
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Employee UUID
 *     responses:
 *       204:
 *         description: Employee deleted successfully
 *       404:
 *         description: Employee not found
 */
router.delete("/:id", validateParams(idParamSchema), controller.delete);

export default router;
