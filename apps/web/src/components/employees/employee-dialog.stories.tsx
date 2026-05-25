import type { Employee } from "@repo/types";
import type { Meta, StoryObj } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { EmployeeDialog } from "./employee-dialog";

const queryClient = new QueryClient();

const meta: Meta<typeof EmployeeDialog> = {
	title: "Components/Employees/EmployeeDialog",
	component: EmployeeDialog,
	decorators: [
		(Story) => (
			<QueryClientProvider client={queryClient}>
				<Story />
			</QueryClientProvider>
		),
	],
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof EmployeeDialog>;

const mockEmployee: Employee = {
	id: "1",
	firstName: "John",
	lastName: "Doe",
	fullName: "John Doe",
	email: "john.doe@company.com",
	phone: "+1234567890",
	country: "US",
	currency: "USD",
	salary: 95000,
	department: "Engineering",
	jobTitle: "Senior Software Engineer",
	employmentType: "FULL_TIME",
	joiningDate: new Date("2022-03-15"),
	status: "ACTIVE",
	salaryBand: "SENIOR",
	bonusEligible: true,
	location: "New York, NY",
	timezone: "America/New_York",
	managerName: "Jane Smith",
	performanceRating: 4.5,
	createdAt: new Date(),
	updatedAt: new Date(),
};

export const AddEmployee: Story = {
	args: {
		open: true,
		onClose: () => console.log("Close dialog"),
		employee: null,
	},
};

export const EditEmployee: Story = {
	args: {
		open: true,
		onClose: () => console.log("Close dialog"),
		employee: mockEmployee,
	},
};

export const Closed: Story = {
	args: {
		open: false,
		onClose: () => console.log("Close dialog"),
		employee: null,
	},
};
