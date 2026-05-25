import { z } from "zod";

export const registerSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8).max(100),
	firstName: z.string().min(1).max(100),
	lastName: z.string().min(1).max(100),
});

export const loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(1),
});

export const refreshTokenSchema = z.object({
	refreshToken: z.string().min(1),
});
