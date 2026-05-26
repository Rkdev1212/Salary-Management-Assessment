import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { EmployeeDialog } from "@/components/employees/employee-dialog";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: { retry: false },
		mutations: { retry: false },
	},
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
	<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe("EmployeeDialog", () => {
	it("does not render when closed", () => {
		const { container } = render(
			<EmployeeDialog open={false} onClose={vi.fn()} employee={null} />,
			{ wrapper },
		);

		expect(container.firstChild).toBeNull();
	});

	it("renders add employee dialog", () => {
		render(<EmployeeDialog open={true} onClose={vi.fn()} employee={null} />, {
			wrapper,
		});

		expect(screen.getByText("Add Employee")).toBeInTheDocument();
		expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
	});

	it("renders edit employee dialog with data", () => {
		const employee = {
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
			employmentType: "FULL_TIME" as const,
			joiningDate: new Date("2023-01-15"),
			status: "ACTIVE" as const,
			salaryBand: "MID" as const,
			bonusEligible: true,
			location: "New York",
			timezone: "America/New_York",
			managerName: null,
			performanceRating: null,
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		render(
			<EmployeeDialog open={true} onClose={vi.fn()} employee={employee} />,
			{ wrapper },
		);

		expect(screen.getByText("Edit Employee")).toBeInTheDocument();
		expect(screen.getByDisplayValue("John")).toBeInTheDocument();
		expect(screen.getByDisplayValue("Doe")).toBeInTheDocument();
	});
});
