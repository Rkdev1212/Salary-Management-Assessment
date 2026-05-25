import { createApp } from "./app";
import { connectDatabase, disconnectDatabase } from "./config/database";
import { env } from "./config/env";
import { logger } from "./config/logger";

async function bootstrap(): Promise<void> {
	try {
		// Connect to database
		await connectDatabase();

		// Create Express app
		const app = createApp();

		// Start server
		const server = app.listen(env.PORT, () => {
			logger.info(`Server running on port ${env.PORT}`);
			logger.info(`Environment: ${env.NODE_ENV}`);
			logger.info(`API URL: http://localhost:${env.PORT}/api`);
		});

		// Graceful shutdown
		const shutdown = async (signal: string): Promise<void> => {
			logger.info(`${signal} received, shutting down gracefully`);
			server.close(async () => {
				await disconnectDatabase();
				logger.info("Server closed");
				process.exit(0);
			});

			// Force shutdown after 10 seconds
			setTimeout(() => {
				logger.error("Forced shutdown after timeout");
				process.exit(1);
			}, 10000);
		};

		process.on("SIGTERM", () => shutdown("SIGTERM"));
		process.on("SIGINT", () => shutdown("SIGINT"));
	} catch (error) {
		logger.error("Failed to start server", error);
		process.exit(1);
	}
}

bootstrap();
