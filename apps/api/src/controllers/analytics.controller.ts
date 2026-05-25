import type { ApiResponse } from "@repo/types";
import type { NextFunction, Request, Response } from "express";
import { AnalyticsService } from "../services/analytics.service";

export class AnalyticsController {
	private service: AnalyticsService;

	constructor() {
		this.service = new AnalyticsService();
	}

	getDashboard = async (
		_req: Request,
		res: Response<ApiResponse>,
		next: NextFunction,
	): Promise<void> => {
		try {
			const dashboard = await this.service.getDashboard();
			res.json({
				success: true,
				data: dashboard,
			});
		} catch (error) {
			next(error);
		}
	};

	getCountrySalaryStats = async (
		_req: Request,
		res: Response<ApiResponse>,
		next: NextFunction,
	): Promise<void> => {
		try {
			const stats = await this.service.getCountrySalaryStats();
			res.json({
				success: true,
				data: stats,
			});
		} catch (error) {
			next(error);
		}
	};

	getJobTitleSalaryStats = async (
		_req: Request,
		res: Response<ApiResponse>,
		next: NextFunction,
	): Promise<void> => {
		try {
			const stats = await this.service.getJobTitleSalaryStats();
			res.json({
				success: true,
				data: stats,
			});
		} catch (error) {
			next(error);
		}
	};

	getDepartmentStats = async (
		_req: Request,
		res: Response<ApiResponse>,
		next: NextFunction,
	): Promise<void> => {
		try {
			const stats = await this.service.getDepartmentStats();
			res.json({
				success: true,
				data: stats,
			});
		} catch (error) {
			next(error);
		}
	};
}
