import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Employee } from "@repo/types";
import { AnalyticsService } from "./analytics.service";

vi.mock("../config/database", () => ({
	prisma: {
		employee: {
			findMany: vi.fn(),
			groupBy: vi.fn(),
		},
	},
}));

describe("AnalyticsService", () => {
	let service: AnalyticsService;

	beforeEach(() => {
		service = new AnalyticsService();
		vi.clearAllMocks();
	});

	describe("getDashboard", () => {
		it("returns dashboard analytics", async () => {
			const { prisma } = await import("../config/database");

			const mockEmployees: Employee[] = [
				{
					id: "1",
					firstName: "John",
					lastName: "Doe",
					email: "john@example.com",
					phone: "+1234567890",
					country: "US",
					currency: "USD",
					salary: 75000,
					department: "Engineering",
					jobTitle: "Developer",
					employmentType: "FULL_TIME",
					joiningDate: new Date("2023-01-15"),
					status: "ACTIVE",
					salaryBand: "MID",
					bonusEligible: true,
					location: "New York",
					timezone: "America/New_York",
					managerName: null,
					performanceRating: null,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			];

			vi.mocked(prisma.employee.findMany).mockResolvedValue(mockEmployees);

			const result = await service.getDashboard();

			expect(result).toHaveProperty("totalEmployees");
			expect(result).toHaveProperty("activeEmployees");
			expect(result).toHaveProperty("avgCompanyWideSalary");
			expect(result).toHaveProperty("medianCompanyWideSalary");
			expect(result.totalEmployees).toBe(1);
			expect(result.activeEmployees).toBe(1);
		});
	});
});
