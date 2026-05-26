import type { Employee } from "@repo/types";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { EmployeeTable } from "@/components/employees/employee-table";

const mockEmployees: Employee[] = [
	{
		id: "1",
		firstName: "John",
		lastName: "Doe",
		fullName: "John Doe",
		email: "john@example.com",
		phone: "+1234567890",
		country: "US",
		currency: "USD",
		salary: 75000,
		department: "Engineering",
		jobTitle: "Senior Developer",
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

describe("EmployeeTable", () => {
	it("renders loading state", () => {
		render(
			<EmployeeTable
				data={[]}
				isLoading={true}
				onPageChange={vi.fn()}
				onEdit={vi.fn()}
				onDelete={vi.fn()}
				onToggleStatus={vi.fn()}
			/>,
		);

		expect(screen.getByText(/loading employees/i)).toBeInTheDocument();
	});

	it("renders empty state when no data", () => {
		render(
			<EmployeeTable
				data={[]}
				isLoading={false}
				onPageChange={vi.fn()}
				onEdit={vi.fn()}
				onDelete={vi.fn()}
				onToggleStatus={vi.fn()}
			/>,
		);

		expect(screen.getByText(/no employees found/i)).toBeInTheDocument();
	});

	it("renders employee data", () => {
		render(
			<EmployeeTable
				data={mockEmployees}
				isLoading={false}
				onPageChange={vi.fn()}
				onEdit={vi.fn()}
				onDelete={vi.fn()}
				onToggleStatus={vi.fn()}
			/>,
		);

		expect(screen.getByText("John Doe")).toBeInTheDocument();
		expect(screen.getByText("john@example.com")).toBeInTheDocument();
		expect(screen.getByText("Senior Developer")).toBeInTheDocument();
	});

	it("calls onEdit when edit button is clicked", () => {
		const onEdit = vi.fn();
		render(
			<EmployeeTable
				data={mockEmployees}
				isLoading={false}
				onPageChange={vi.fn()}
				onEdit={onEdit}
				onDelete={vi.fn()}
				onToggleStatus={vi.fn()}
			/>,
		);

		const editButtons = screen.getAllByTitle("Edit");
		editButtons[0]?.click();

		expect(onEdit).toHaveBeenCalledWith(mockEmployees[0]);
	});
});
