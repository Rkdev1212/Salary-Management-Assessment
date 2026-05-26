/**
 * @openapi
 * components:
 *   schemas:
 *     Employee:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         email:
 *           type: string
 *         phone:
 *           type: string
 *         department:
 *           type: string
 *         jobTitle:
 *           type: string
 *         employmentType:
 *           type: string
 *           enum: [FULL_TIME, PART_TIME, CONTRACT]
 *         status:
 *           type: string
 *           enum: [ACTIVE, INACTIVE]
 *         salary:
 *           type: number
 *         currency:
 *           type: string
 *         joiningDate:
 *           type: string
 *           format: date
 *
 *     CreateEmployeeDto:
 *       allOf:
 *         - $ref: "#/components/schemas/Employee"
 *         - required: [firstName, lastName, email]
 *
 *     UpdateEmployeeDto:
 *       allOf:
 *         - $ref: "#/components/schemas/Employee"
 *         - required: []
 *
 *     EmployeePaginatedResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/Employee"
 *         meta:
 *           type: object
 *           properties:
 *             total:
 *               type: integer
 *             page:
 *               type: integer
 *             limit:
 *               type: integer
 *
 *     EmployeeFilters:
 *       type: object
 *       properties:
 *         departments:
 *           type: array
 *           items:
 *             type: string
 *         statuses:
 *           type: array
 *           items:
 *             type: string
 *
 *     AnalyticsDashboard:
 *       type: object
 *       properties:
 *         totalEmployees:
 *           type: integer
 *         activeEmployees:
 *           type: integer
 *         avgSalary:
 *           type: number
 *
 */
