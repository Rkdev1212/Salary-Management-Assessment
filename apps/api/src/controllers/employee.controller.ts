import type {
	ApiResponse,
	CreateEmployeeDto,
	EmployeeFilters,
	PaginationParams,
	UpdateEmployeeDto,
} from "@repo/types";
import type { NextFunction, Request, Response } from "express";
import { EmployeeService } from "../services/employee.service";

export class EmployeeController {
	private service: EmployeeService;

	constructor() {
		this.service = new EmployeeService();
	}

	create = async (
		req: Request<object, object, CreateEmployeeDto>,
		res: Response<ApiResponse>,
		next: NextFunction,
	): Promise<void> => {
		try {
			const employee = await this.service.create(req.body);
			res.status(201).json({
				success: true,
				data: employee,
				message: "Employee created successfully",
			});
		} catch (error) {
			next(error);
		}
	};

	findAll = async (
		req: Request<object, object, object, PaginationParams & EmployeeFilters>,
		res: Response<ApiResponse>,
		next: NextFunction,
	): Promise<void> => {
		try {
			const { page, limit, sortBy, sortOrder, ...filters } = req.query;
			const pagination: PaginationParams = { page, limit, sortBy, sortOrder };

			const result = await this.service.findAll(pagination, filters);
			res.json({
				success: true,
				data: result,
			});
		} catch (error) {
			next(error);
		}
	};

	findById = async (
		req: Request<{ id: string }>,
		res: Response<ApiResponse>,
		next: NextFunction,
	): Promise<void> => {
		try {
			const employee = await this.service.findById(req.params.id);
			res.json({
				success: true,
				data: employee,
			});
		} catch (error) {
			next(error);
		}
	};

	update = async (
		req: Request<{ id: string }, object, UpdateEmployeeDto>,
		res: Response<ApiResponse>,
		next: NextFunction,
	): Promise<void> => {
		try {
			const employee = await this.service.update(req.params.id, req.body);
			res.json({
				success: true,
				data: employee,
				message: "Employee updated successfully",
			});
		} catch (error) {
			next(error);
		}
	};

	delete = async (
		req: Request<{ id: string }>,
		res: Response<ApiResponse>,
		next: NextFunction,
	): Promise<void> => {
		try {
			await this.service.delete(req.params.id);
			res.json({
				success: true,
				message: "Employee deleted successfully",
			});
		} catch (error) {
			next(error);
		}
	};

	getFilters = async (
		_req: Request,
		res: Response<ApiResponse>,
		next: NextFunction,
	): Promise<void> => {
		try {
			const filters = await this.service.getFilters();
			res.json({
				success: true,
				data: filters,
			});
		} catch (error) {
			next(error);
		}
	};
}
