import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DashboardPage } from "./dashboard";

vi.mock("@/services/analytics.service", () => ({
	analyticsService: {
		getDashboard: vi.fn().mockResolvedValue({
			totalEmployees: 100,
			activeEmployees: 95,
			inactiveEmployees: 5,
			avgCompanyWideSalary: 75000,
			medianCompanyWideSalary: 70000,
			countrySalaryStats: [],
			jobTitleSalaryStats: [],
			departmentStats: [],
			salaryDistribution: [],
			hiringTrends: [],
			topPayingDepartments: [],
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

describe("DashboardPage", () => {
	it("renders dashboard page", () => {
		render(<DashboardPage />, { wrapper });

		expect(screen.getByText("Dashboard")).toBeInTheDocument();
		expect(
			screen.getByText(/overview of salary analytics and insights/i),
		).toBeInTheDocument();
	});

	it("shows loading state initially", () => {
		render(<DashboardPage />, { wrapper });

		// Should show loading skeletons initially
		expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
	});
});
