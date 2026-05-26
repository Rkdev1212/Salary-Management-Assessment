import cors from "cors";
import express, { type Application } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { env } from "./config/env";
import { errorHandler } from "./middleware/error-handler";
import { requestLogger } from "./middleware/request-logger";
import routes from "./routes";
import { setupSwagger } from "./swagger";

export function createApp(): Application {
	const app = express();

	// Security middleware
	app.use(helmet());
	app.use(
		cors({
			origin: "*",
			credentials: true,
		}),
	);

	// Rate limiting
	const limiter = rateLimit({
		windowMs: env.RATE_LIMIT_TTL * 1000,
		max: env.RATE_LIMIT_MAX,
		message: "Too many requests from this IP, please try again later",
		standardHeaders: true,
		legacyHeaders: false,
	});
	app.use("/api", limiter);

	// Body parsing
	app.use(express.json({ limit: "10mb" }));
	app.use(express.urlencoded({ extended: true, limit: "10mb" }));

	// Logging
	app.use(requestLogger);

	// Routes
	app.use("/api", routes);
	// Swagger UI
	setupSwagger(app);

	// Error handling
	app.use(errorHandler);

	return app;
}
