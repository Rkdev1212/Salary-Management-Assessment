import type { NextFunction, Request, Response } from "express";
import { type ZodSchema, z } from "zod";

export function validateBody<T extends ZodSchema>(schema: T) {
	return (req: Request, _res: Response, next: NextFunction): void => {
		try {
			req.body = schema.parse(req.body);
			next();
		} catch (error) {
			next(error);
		}
	};
}

export function validateQuery<T extends ZodSchema>(schema: T) {
	return (req: Request, _res: Response, next: NextFunction): void => {
		try {
			req.query = schema.parse(req.query);
			next();
		} catch (error) {
			next(error);
		}
	};
}

export function validateParams<T extends ZodSchema>(schema: T) {
	return (req: Request, _res: Response, next: NextFunction): void => {
		try {
			req.params = schema.parse(req.params);
			next();
		} catch (error) {
			next(error);
		}
	};
}
