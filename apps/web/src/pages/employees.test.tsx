import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { EmployeesPage } from "./employees";

vi.mock("@/services/employee.service", () => ({
	employeeService: {
		getAll: vi.fn().mockResolvedValue({
			data: [],
			meta: { page: 1, limit: 20, total: 0, totalPages: 0 },
		}),
		getFilters: vi.fn().mockResolvedValue({
			countries: [],
			departments: [],
		}),
	},
}));

const queryClient = new QueryClient({
	defaultOptions: {
		queries: { retry: false },
	},
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
	<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe("EmployeesPage", () => {
	it("renders employees page", () => {
		render(<EmployeesPage />, { wrapper });

		expect(screen.getByText("Employees")).toBeInTheDocument();
		expect(
			screen.getByText(/manage your organization's employee records/i),
		).toBeInTheDocument();
	});

	it("has add employee button", () => {
		render(<EmployeesPage />, { wrapper });

		expect(screen.getByText("Add Employee")).toBeInTheDocument();
	});

	it("has search input", () => {
		render(<EmployeesPage />, { wrapper });

		expect(
			screen.getByPlaceholderText(/search employees/i),
		).toBeInTheDocument();
	});

	it("has filters button", () => {
		render(<EmployeesPage />, { wrapper });

		expect(screen.getByText("Filters")).toBeInTheDocument();
	});
});
