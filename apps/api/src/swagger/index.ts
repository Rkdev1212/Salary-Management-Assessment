import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import type { Express } from "express";
import { env } from "../config/env";

export const setupSwagger = (app: Express): void => {
	const docsPath =
		env.NODE_ENV === "production"
			? ["./dist/routes/*.js", "./dist/swagger/*.js"]
			: ["./src/routes/*.ts", "./src/swagger/*.ts"];

	const options = {
		definition: {
			openapi: "3.0.0",
			info: {
				title: "Salary Management API",
				version: "1.0.0",
				description: "API documentation for Salary Management Platform",
			},
			servers: [
				{ url: `${env.BASE_URL ?? "http://localhost"}:${env.PORT}/api` },
			],
			components: {
				securitySchemes: {
					bearerAuth: {
						type: "http",
						scheme: "bearer",
						bearerFormat: "JWT",
						description: "Enter your JWT token as: Bearer <token>",
					},
				},
			},
			security: [{ bearerAuth: [] }],
		},
		apis: docsPath,
	};

	const swaggerSpec = swaggerJSDoc(options);
	app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
