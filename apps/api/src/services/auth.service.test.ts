import { beforeEach, describe, expect, it, vi } from "vitest";
import { ConflictError, UnauthorizedError } from "../middleware/error-handler";
import { AuthService } from "./auth.service";

// Mock prisma
vi.mock("../config/database", () => ({
	prisma: {
		user: {
			findUnique: vi.fn(),
			create: vi.fn(),
			update: vi.fn(),
		},
	},
}));

describe("AuthService", () => {
	let authService: AuthService;

	beforeEach(() => {
		authService = new AuthService();
		vi.clearAllMocks();
	});

	describe("register", () => {
		it("should create a new user", async () => {
			const mockUser = {
				id: "1",
				email: "test@example.com",
				password: "hashedpassword",
				firstName: "Test",
				lastName: "User",
				role: "HR_MANAGER",
				refreshToken: null,
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			const { prisma } = await import("../config/database");
			vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
			vi.mocked(prisma.user.create).mockResolvedValue(mockUser);
			vi.mocked(prisma.user.update).mockResolvedValue(mockUser);

			const result = await authService.register({
				email: "test@example.com",
				password: "password123",
				firstName: "Test",
				lastName: "User",
			});

			expect(result).toHaveProperty("user");
			expect(result).toHaveProperty("tokens");
			expect(result.user.email).toBe("test@example.com");
		});

		it("should throw ConflictError if user exists", async () => {
			const { prisma } = await import("../config/database");
			vi.mocked(prisma.user.findUnique).mockResolvedValue({
				id: "1",
				email: "test@example.com",
				password: "hashedpassword",
				firstName: "Test",
				lastName: "User",
				role: "HR_MANAGER",
				refreshToken: null,
				createdAt: new Date(),
				updatedAt: new Date(),
			});

			await expect(
				authService.register({
					email: "test@example.com",
					password: "password123",
					firstName: "Test",
					lastName: "User",
				}),
			).rejects.toThrow(ConflictError);
		});
	});

	describe("login", () => {
		it("should throw UnauthorizedError for invalid credentials", async () => {
			const { prisma } = await import("../config/database");
			vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

			await expect(
				authService.login({
					email: "test@example.com",
					password: "wrongpassword",
				}),
			).rejects.toThrow(UnauthorizedError);
		});
	});
});
