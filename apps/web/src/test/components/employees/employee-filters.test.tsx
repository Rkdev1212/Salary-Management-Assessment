import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { EmployeeFilters } from "@/components/employees/employee-filters";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: { retry: false },
	},
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
	<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe("EmployeeFilters", () => {
	it("renders filter controls", () => {
		render(<EmployeeFilters filters={{}} onFiltersChange={vi.fn()} />, {
			wrapper,
		});

		expect(screen.getByText("Country")).toBeInTheDocument();
		expect(screen.getByText("Department")).toBeInTheDocument();
		expect(screen.getByText("Employment Type")).toBeInTheDocument();
		expect(screen.getByText("Status")).toBeInTheDocument();
	});

	it("renders clear filters button", () => {
		render(<EmployeeFilters filters={{}} onFiltersChange={vi.fn()} />, {
			wrapper,
		});

		expect(screen.getByText("Clear Filters")).toBeInTheDocument();
	});
});
