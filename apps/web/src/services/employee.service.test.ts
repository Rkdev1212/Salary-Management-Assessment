import { apiClient } from "@/lib/api-client";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { employeeService } from "./employee.service";

vi.mock("@/lib/api-client", () => ({
	apiClient: {
		get: vi.fn(),
		post: vi.fn(),
		put: vi.fn(),
		delete: vi.fn(),
	},
}));

describe("EmployeeService", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("getAll", () => {
		it("fetches employees with pagination", async () => {
			const mockResponse = {
				data: {
					data: [],
					meta: { page: 1, limit: 20, total: 0, totalPages: 0 },
				},
			};

			vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

			const result = await employeeService.getAll({ page: 1, limit: 20 }, {});

			expect(apiClient.get).toHaveBeenCalledWith("/employees", {
				params: { page: 1, limit: 20 },
			});
			expect(result).toEqual(mockResponse.data);
		});

		it("includes filters in request", async () => {
			const mockResponse = { data: { data: [], meta: {} } };
			vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

			await employeeService.getAll({ page: 1, limit: 20 }, { country: "US" });

			expect(apiClient.get).toHaveBeenCalledWith("/employees", {
				params: { page: 1, limit: 20, country: "US" },
			});
		});
	});

	describe("getById", () => {
		it("fetches employee by id", async () => {
			const mockEmployee = { id: "1", firstName: "John", lastName: "Doe" };
			vi.mocked(apiClient.get).mockResolvedValue({ data: mockEmployee });

			const result = await employeeService.getById("1");

			expect(apiClient.get).toHaveBeenCalledWith("/employees/1");
			expect(result).toEqual(mockEmployee);
		});
	});

	describe("create", () => {
		it("creates a new employee", async () => {
			const newEmployee = {
				firstName: "John",
				lastName: "Doe",
				email: "john@example.com",
				phone: "+1234567890",
				country: "US",
				currency: "USD",
				salary: 75000,
				department: "Engineering",
				jobTitle: "Developer",
				employmentType: "FULL_TIME" as const,
				joiningDate: new Date(),
				status: "ACTIVE" as const,
				salaryBand: "MID" as const,
				bonusEligible: true,
				location: "New York",
				timezone: "America/New_York",
			};
			const mockResponse = { data: { id: "1", ...newEmployee } };

			vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

			const result = await employeeService.create(newEmployee);

			expect(apiClient.post).toHaveBeenCalledWith("/employees", newEmployee);
			expect(result).toEqual(mockResponse.data);
		});
	});

	describe("update", () => {
		it("updates an employee", async () => {
			const updates = { firstName: "Jane" };
			const mockResponse = { data: { id: "1", ...updates } };

			vi.mocked(apiClient.put).mockResolvedValue(mockResponse);

			const result = await employeeService.update("1", updates);

			expect(apiClient.put).toHaveBeenCalledWith("/employees/1", updates);
			expect(result).toEqual(mockResponse.data);
		});
	});

	describe("delete", () => {
		it("deletes an employee", async () => {
			vi.mocked(apiClient.delete).mockResolvedValue({ data: undefined });

			await employeeService.delete("1");

			expect(apiClient.delete).toHaveBeenCalledWith("/employees/1");
		});
	});
});
