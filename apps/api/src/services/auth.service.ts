import bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { prisma } from "../config/database";
import { env } from "../config/env";
import { UnauthorizedError, ConflictError } from "../middleware/error-handler";
import type {
	LoginDto,
	RegisterDto,
	AuthResponse,
	AuthTokens,
	AuthUser,
} from "@repo/types";

export class AuthService {
	private readonly SALT_ROUNDS = 12;

	async register(dto: RegisterDto): Promise<AuthResponse> {
		const existingUser = await prisma.user.findUnique({
			where: { email: dto.email },
		});

		if (existingUser) {
			throw new ConflictError("User already exists");
		}

		const hashedPassword = await bcrypt.hash(dto.password, this.SALT_ROUNDS);

		const user = await prisma.user.create({
			data: {
				email: dto.email,
				password: hashedPassword,
				firstName: dto.firstName,
				lastName: dto.lastName,
			},
		});

		const tokens = this.generateTokens(user);

		await prisma.user.update({
			where: { id: user.id },
			data: { refreshToken: tokens.refreshToken },
		});

		return {
			user: this.mapToAuthUser(user),
			tokens,
		};
	}

	async login(dto: LoginDto): Promise<AuthResponse> {
		const user = await prisma.user.findUnique({
			where: { email: dto.email },
		});

		if (!user) {
			throw new UnauthorizedError("Invalid credentials");
		}

		const isPasswordValid = await bcrypt.compare(dto.password, user.password);

		if (!isPasswordValid) {
			throw new UnauthorizedError("Invalid credentials");
		}

		const tokens = this.generateTokens(user);

		await prisma.user.update({
			where: { id: user.id },
			data: { refreshToken: tokens.refreshToken },
		});

		return {
			user: this.mapToAuthUser(user),
			tokens,
		};
	}

	async refreshToken(refreshToken: string): Promise<AuthTokens> {
		try {
			const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as {
				userId: string;
			};

			const user = await prisma.user.findUnique({
				where: { id: decoded.userId },
			});

			if (!user || user.refreshToken !== refreshToken) {
				throw new UnauthorizedError("Invalid refresh token");
			}

			const tokens = this.generateTokens(user);

			await prisma.user.update({
				where: { id: user.id },
				data: { refreshToken: tokens.refreshToken },
			});

			return tokens;
		} catch (error) {
			throw new UnauthorizedError("Invalid refresh token");
		}
	}

	async logout(userId: string): Promise<void> {
		await prisma.user.update({
			where: { id: userId },
			data: { refreshToken: null },
		});
	}

	private generateTokens(user: {
		id: string;
		email: string;
		firstName: string;
		lastName: string;
		role: string;
	}): AuthTokens {
		const secret = env.JWT_SECRET as jwt.Secret;
		const refreshSecret = env.JWT_REFRESH_SECRET as jwt.Secret;

		const accessOptions: jwt.SignOptions = {
			expiresIn: env.JWT_EXPIRATION as jwt.SignOptions["expiresIn"],
		};

		const accessToken = (jwt.sign as any)(
			{
				userId: user.id,
				email: user.email,
				firstName: user.firstName,
				lastName: user.lastName,
				role: user.role,
			},
			secret,
			accessOptions,
		);

		const refreshOptions: jwt.SignOptions = {
			expiresIn: env.JWT_REFRESH_EXPIRATION as jwt.SignOptions["expiresIn"],
		};

		const refreshToken = (jwt.sign as any)(
			{ userId: user.id },
			refreshSecret,
			refreshOptions,
		);

		return { accessToken, refreshToken };
	}

	private mapToAuthUser(user: {
		id: string;
		email: string;
		firstName: string;
		lastName: string;
		role: string;
	}): AuthUser {
		return {
			id: user.id,
			email: user.email,
			firstName: user.firstName,
			lastName: user.lastName,
			role: user.role,
		};
	}
}
