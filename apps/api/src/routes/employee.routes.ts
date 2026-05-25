import { Router } from "express";
import { EmployeeController } from "../controllers/employee.controller";
import {
	validateBody,
	validateParams,
	validateQuery,
} from "../middleware/validate";
import { authenticate } from "../middleware/auth";
import {
	createEmployeeSchema,
	updateEmployeeSchema,
	paginationSchema,
	employeeFiltersSchema,
	idParamSchema,
} from "../validators/employee.validator";

const router = Router();
const controller = new EmployeeController();

// All routes require authentication
router.use(authenticate);

router.get(
	"/",
	validateQuery(paginationSchema.merge(employeeFiltersSchema)),
	controller.findAll,
);
router.get("/filters", controller.getFilters);
router.get("/:id", validateParams(idParamSchema), controller.findById);
router.post("/", validateBody(createEmployeeSchema), controller.create);
router.put(
	"/:id",
	validateParams(idParamSchema),
	validateBody(updateEmployeeSchema),
	controller.update,
);
router.delete("/:id", validateParams(idParamSchema), controller.delete);

export default router;
