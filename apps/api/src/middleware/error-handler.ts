import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { logger } from "../config/logger";
import type { ApiError } from "@repo/types";

export class AppError extends Error {
	constructor(
		public statusCode: number,
		public message: string,
		public isOperational = true,
	) {
		super(message);
		Object.setPrototypeOf(this, AppError.prototype);
	}
}

export class NotFoundError extends AppError {
	constructor(message = "Resource not found") {
		super(404, message);
	}
}

export class UnauthorizedError extends AppError {
	constructor(message = "Unauthorized") {
		super(401, message);
	}
}

export class ForbiddenError extends AppError {
	constructor(message = "Forbidden") {
		super(403, message);
	}
}

export class ValidationError extends AppError {
	constructor(message = "Validation failed") {
		super(400, message);
	}
}

export class ConflictError extends AppError {
	constructor(message = "Resource already exists") {
		super(409, message);
	}
}

export function errorHandler(
	err: Error,
	req: Request,
	res: Response<ApiError>,
	_next: NextFunction,
): void {
	logger.error("Error occurred", {
		error: err.message,
		stack: err.stack,
		path: req.path,
		method: req.method,
	});

	// Zod validation errors
	if (err instanceof ZodError) {
		res.status(400).json({
			statusCode: 400,
			message: "Validation failed",
			error: err.errors
				.map((e) => `${e.path.join(".")}: ${e.message}`)
				.join(", "),
			timestamp: new Date().toISOString(),
			path: req.path,
		});
		return;
	}

	// Application errors
	if (err instanceof AppError) {
		res.status(err.statusCode).json({
			statusCode: err.statusCode,
			message: err.message,
			error: err.message,
			timestamp: new Date().toISOString(),
			path: req.path,
		});
		return;
	}

	// Prisma errors
	if (err.constructor.name === "PrismaClientKnownRequestError") {
		const prismaError = err as { code: string; meta?: { target?: string[] } };
		if (prismaError.code === "P2002") {
			res.status(409).json({
				statusCode: 409,
				message: "Resource already exists",
				error: `Duplicate field: ${prismaError.meta?.target?.join(", ") ?? "unknown"}`,
				timestamp: new Date().toISOString(),
				path: req.path,
			});
			return;
		}
	}

	// Default error
	res.status(500).json({
		statusCode: 500,
		message: "Internal server error",
		error:
			process.env.NODE_ENV === "development"
				? err.message
				: "Something went wrong",
		timestamp: new Date().toISOString(),
		path: req.path,
	});
}
