import type { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import type {
	LoginDto,
	RegisterDto,
	ApiResponse,
	AuthResponse,
} from "@repo/types";
import type { AuthRequest } from "../middleware/auth";

export class AuthController {
	private service: AuthService;

	constructor() {
		this.service = new AuthService();
	}

	register = async (
		req: Request<object, object, RegisterDto>,
		res: Response<ApiResponse<AuthResponse>>,
		next: NextFunction,
	): Promise<void> => {
		try {
			const result = await this.service.register(req.body);
			res.status(201).json({
				success: true,
				data: result,
				message: "User registered successfully",
			});
		} catch (error) {
			next(error);
		}
	};

	login = async (
		req: Request<object, object, LoginDto>,
		res: Response<ApiResponse<AuthResponse>>,
		next: NextFunction,
	): Promise<void> => {
		try {
			const result = await this.service.login(req.body);
			res.json({
				success: true,
				data: result,
				message: "Login successful",
			});
		} catch (error) {
			next(error);
		}
	};

	refreshToken = async (
		req: Request<object, object, { refreshToken: string }>,
		res: Response<ApiResponse>,
		next: NextFunction,
	): Promise<void> => {
		try {
			const tokens = await this.service.refreshToken(req.body.refreshToken);
			res.json({
				success: true,
				data: tokens,
				message: "Token refreshed successfully",
			});
		} catch (error) {
			next(error);
		}
	};

	logout = async (
		req: AuthRequest,
		res: Response<ApiResponse>,
		next: NextFunction,
	): Promise<void> => {
		try {
			if (!req.user) {
				throw new Error("User not authenticated");
			}
			await this.service.logout(req.user.id);
			res.json({
				success: true,
				message: "Logout successful",
			});
		} catch (error) {
			next(error);
		}
	};

	me = async (
		req: AuthRequest,
		res: Response<ApiResponse>,
		next: NextFunction,
	): Promise<void> => {
		try {
			res.json({
				success: true,
				data: req.user,
			});
		} catch (error) {
			next(error);
		}
	};
}
