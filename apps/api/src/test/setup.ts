import { afterAll, afterEach, beforeAll } from "vitest";
import { prisma } from "../config/database";

beforeAll(async () => {
	// Setup test database if needed
});

afterEach(async () => {
	// Clean up test data after each test
});

afterAll(async () => {
	await prisma.$disconnect();
});
