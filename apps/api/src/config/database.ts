import { PrismaClient } from "@prisma/client";
import { logger } from "./logger";

const prismaClientSingleton = () => {
	return new PrismaClient({
		log: [
			{ level: "query", emit: "event" },
			{ level: "error", emit: "stdout" },
			{ level: "warn", emit: "stdout" },
		],
	});
};

declare global {
	// eslint-disable-next-line no-var
	var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
	globalThis.prismaGlobal = prisma;
}

// Log slow queries in development
prisma.$on("query", (e) => {
	if (e.duration > 1000) {
		logger.warn("Slow query detected", {
			query: e.query,
			duration: `${e.duration}ms`,
		});
	}
});

export async function connectDatabase(): Promise<void> {
	try {
		await prisma.$connect();
		logger.info("Database connected successfully");
	} catch (error) {
		logger.error("Database connection failed", error);
		throw error;
	}
}

export async function disconnectDatabase(): Promise<void> {
	await prisma.$disconnect();
	logger.info("Database disconnected");
}
