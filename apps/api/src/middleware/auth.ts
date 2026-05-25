import type { AuthUser } from "@repo/types";
import type { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { env } from "../config/env";
import { UnauthorizedError } from "./error-handler";

export interface AuthRequest extends Request {
	user?: AuthUser;
}

export function authenticate(
	req: AuthRequest,
	_res: Response,
	next: NextFunction,
): void {
	try {
		const authHeader = req.headers.authorization;

		if (!authHeader?.startsWith("Bearer ")) {
			throw new UnauthorizedError("No token provided");
		}

		const token = authHeader.substring(7);

		const payload = jwt.verify(token, env.JWT_SECRET);

		if (typeof payload !== "object" || payload === null) {
			throw new UnauthorizedError("Invalid token payload");
		}

		const decoded = payload as jwt.JwtPayload;

		// Map userId from JWT to id for AuthUser
		req.user = {
			id: String(decoded.userId),
			email: String(decoded.email),
			firstName: String(decoded.firstName),
			lastName: String(decoded.lastName),
			role: String(decoded.role),
		};

		next();
	} catch (error) {
		if (error instanceof jwt.JsonWebTokenError) {
			next(new UnauthorizedError("Invalid token"));
		} else if (error instanceof jwt.TokenExpiredError) {
			next(new UnauthorizedError("Token expired"));
		} else {
			next(error);
		}
	}
}

export function authorize(...roles: string[]) {
	return (req: AuthRequest, _res: Response, next: NextFunction): void => {
		if (!req.user) {
			throw new UnauthorizedError("User not authenticated");
		}

		if (roles.length && !roles.includes(req.user.role)) {
			throw new UnauthorizedError("Insufficient permissions");
		}

		next();
	};
}
