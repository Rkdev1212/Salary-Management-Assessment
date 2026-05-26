import type { Employee } from "@repo/types";
import type { Meta, StoryObj } from "@storybook/react";
import { EmployeeTable } from "./employee-table";

const mockEmployees: Employee[] = [
	{
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
	},
	{
		id: "2",
		firstName: "Sarah",
		lastName: "Johnson",
		fullName: "Sarah Johnson",
		email: "sarah.johnson@company.com",
		phone: "+1234567891",
		country: "UK",
		currency: "GBP",
		salary: 75000,
		department: "Marketing",
		jobTitle: "Marketing Manager",
		employmentType: "FULL_TIME",
		joiningDate: new Date("2021-06-20"),
		status: "ACTIVE",
		salaryBand: "MID",
		bonusEligible: true,
		location: "London",
		timezone: "Europe/London",
		managerName: null,
		performanceRating: 4.0,
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		id: "3",
		firstName: "Michael",
		lastName: "Chen",
		fullName: "Michael Chen",
		email: "michael.chen@company.com",
		phone: "+1234567892",
		country: "CA",
		currency: "CAD",
		salary: 65000,
		department: "Sales",
		jobTitle: "Sales Representative",
		employmentType: "FULL_TIME",
		joiningDate: new Date("2023-01-10"),
		status: "INACTIVE",
		salaryBand: "JUNIOR",
		bonusEligible: false,
		location: "Toronto",
		timezone: "America/Toronto",
		managerName: "Robert Brown",
		performanceRating: 3.5,
		createdAt: new Date(),
		updatedAt: new Date(),
	},
];

const meta: Meta<typeof EmployeeTable> = {
	title: "Components/Employees/EmployeeTable",
	component: EmployeeTable,
	parameters: {
		layout: "padded",
	},
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof EmployeeTable>;

export const Default: Story = {
	args: {
		data: mockEmployees,
		isLoading: false,
		onPageChange: () => {},
		onEdit: (employee) => console.log("Edit:", employee),
		onDelete: (id) => console.log("Delete:", id),
		onToggleStatus: (id, status) => console.log("Toggle status:", id, status),
	},
};

export const Loading: Story = {
	args: {
		data: [],
		isLoading: true,
		onPageChange: () => {},
		onEdit: () => {},
		onDelete: () => {},
		onToggleStatus: () => {},
	},
};

export const Empty: Story = {
	args: {
		data: [],
		isLoading: false,
		onPageChange: () => {},
		onEdit: () => {},
		onDelete: () => {},
		onToggleStatus: () => {},
	},
};

export const WithPagination: Story = {
	args: {
		data: mockEmployees,
		isLoading: false,
		pagination: {
			page: 2,
			limit: 20,
			total: 150,
			totalPages: 8,
			hasNextPage: true,
			hasPreviousPage: true,
		},
		onPageChange: (page) => console.log("Page:", page),
		onEdit: (employee) => console.log("Edit:", employee),
		onDelete: (id) => console.log("Delete:", id),
		onToggleStatus: (id, status) => console.log("Toggle status:", id, status),
	},
};

export const SingleEmployee: Story = {
	args: {
		data: [mockEmployees[0] as Employee],
		isLoading: false,
		onPageChange: () => {},
		onEdit: (employee) => console.log("Edit:", employee),
		onDelete: (id) => console.log("Delete:", id),
		onToggleStatus: (id, status) => console.log("Toggle status:", id, status),
	},
};
