import type { Meta, StoryObj } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { EmployeeFilters } from "./employee-filters";

const queryClient = new QueryClient();

const meta: Meta<typeof EmployeeFilters> = {
	title: "Components/Employees/EmployeeFilters",
	component: EmployeeFilters,
	decorators: [
		(Story) => (
			<QueryClientProvider client={queryClient}>
				<div style={{ maxWidth: 800, padding: 20 }}>
					<Story />
				</div>
			</QueryClientProvider>
		),
	],
	parameters: {
		layout: "padded",
	},
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof EmployeeFilters>;

export const Default: Story = {
	args: {
		filters: {},
		onFiltersChange: (filters) => console.log("Filters changed:", filters),
	},
};

export const WithFilters: Story = {
	args: {
		filters: {
			country: "US",
			department: "Engineering",
			status: "ACTIVE",
		},
		onFiltersChange: (filters) => console.log("Filters changed:", filters),
	},
};

export const AllFiltersApplied: Story = {
	args: {
		filters: {
			country: "UK",
			department: "Marketing",
			employmentType: "FULL_TIME",
			status: "ACTIVE",
		},
		onFiltersChange: (filters) => console.log("Filters changed:", filters),
	},
};
