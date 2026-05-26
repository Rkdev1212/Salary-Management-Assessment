import { beforeEach, describe, expect, it, vi } from "vitest";
import type { CreateEmployeeDto } from "@repo/types";
import { EmployeeRepository } from "../repositories/employee.repository";
import { EmployeeService } from "./employee.service";

vi.mock("../repositories/employee.repository");

describe("EmployeeService", () => {
	let service: EmployeeService;
	let mockRepository: {
		findAll: ReturnType<typeof vi.fn>;
		findById: ReturnType<typeof vi.fn>;
		create: ReturnType<typeof vi.fn>;
		update: ReturnType<typeof vi.fn>;
		delete: ReturnType<typeof vi.fn>;
		count: ReturnType<typeof vi.fn>;
	};

	beforeEach(() => {
		mockRepository = {
			findAll: vi.fn(),
			findById: vi.fn(),
			create: vi.fn(),
			update: vi.fn(),
			delete: vi.fn(),
			count: vi.fn(),
		};

		vi.mocked(EmployeeRepository).mockImplementation(
			() => mockRepository as unknown as EmployeeRepository,
		);
		service = new EmployeeService();
	});

	describe("getAll", () => {
		it("returns paginated employees", async () => {
			const mockEmployees = [{ id: "1", firstName: "John", lastName: "Doe" }];
			mockRepository.findAll.mockResolvedValue(mockEmployees);
			mockRepository.count.mockResolvedValue(1);

			const result = await service.findAll(
				{ page: 1, limit: 20, sortBy: "createdAt", sortOrder: "desc" },
				{},
			);

			expect(result.data).toEqual(mockEmployees);
			expect(result.meta.total).toBe(1);
			expect(result.meta.page).toBe(1);
		});
	});

	describe("getById", () => {
		it("returns employee by id", async () => {
			const mockEmployee = { id: "1", firstName: "John", lastName: "Doe" };
			mockRepository.findById.mockResolvedValue(mockEmployee);

			const result = await service.findById("1");

			expect(result).toEqual(mockEmployee);
			expect(mockRepository.findById).toHaveBeenCalledWith("1");
		});

		it("throws error when employee not found", async () => {
			mockRepository.findById.mockResolvedValue(null);

			await expect(service.findById("999")).rejects.toThrow(
				"Employee not found",
			);
		});
	});

	describe("create", () => {
		it("creates a new employee", async () => {
			const newEmployee: CreateEmployeeDto = {
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
				joiningDate: new Date(),
				status: "ACTIVE",
				salaryBand: "MID",
				bonusEligible: true,
				location: "New York",
				timezone: "America/New_York",
			};
			const createdEmployee = { id: "1", ...newEmployee };

			mockRepository.create.mockResolvedValue(createdEmployee);

			const result = await service.create(newEmployee);

			expect(result).toEqual(createdEmployee);
			expect(mockRepository.create).toHaveBeenCalledWith(newEmployee);
		});
	});

	describe("update", () => {
		it("updates an employee", async () => {
			const updates = { firstName: "Jane" };
			const updatedEmployee = { id: "1", ...updates };

			mockRepository.findById.mockResolvedValue({ id: "1" });
			mockRepository.update.mockResolvedValue(updatedEmployee);

			const result = await service.update("1", updates);

			expect(result).toEqual(updatedEmployee);
			expect(mockRepository.update).toHaveBeenCalledWith("1", updates);
		});
	});

	describe("delete", () => {
		it("deletes an employee", async () => {
			mockRepository.findById.mockResolvedValue({ id: "1" });
			mockRepository.delete.mockResolvedValue(undefined);

			await service.delete("1");

			expect(mockRepository.delete).toHaveBeenCalledWith("1");
		});
	});
});
