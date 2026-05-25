import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
	NODE_ENV: z
		.enum(["development", "production", "test"])
		.default("development"),
	PORT: z.string().transform(Number).default("3001"),
	DATABASE_URL: z.string().url(),
	JWT_SECRET: z.string().min(32),
	JWT_REFRESH_SECRET: z.string().min(32),
	JWT_EXPIRATION: z.string().default("15m"),
	JWT_REFRESH_EXPIRATION: z.string().default("7d"),
	CORS_ORIGIN: z.string().default("http://localhost:3000"),
	RATE_LIMIT_TTL: z.string().transform(Number).default("60"),
	RATE_LIMIT_MAX: z.string().transform(Number).default("100"),
});

export type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
	try {
		return envSchema.parse(process.env);
	} catch (error) {
		if (error instanceof z.ZodError) {
			const missingVars = error.errors.map((e) => e.path.join(".")).join(", ");
			throw new Error(
				`Missing or invalid environment variables: ${missingVars}`,
			);
		}
		throw error;
	}
}

export const env = validateEnv();
