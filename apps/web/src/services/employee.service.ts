import { apiClient } from "@/lib/api-client";
import type {
	Employee,
	CreateEmployeeDto,
	UpdateEmployeeDto,
	PaginatedResponse,
	PaginationParams,
	EmployeeFilters,
} from "@repo/types";

export const employeeService = {
	async getAll(
		pagination: PaginationParams,
		filters?: EmployeeFilters,
	): Promise<PaginatedResponse<Employee>> {
		return apiClient.get("/employees", { ...pagination, ...filters });
	},

	async getById(id: string): Promise<Employee> {
		return apiClient.get(`/employees/${id}`);
	},

	async create(data: CreateEmployeeDto): Promise<Employee> {
		return apiClient.post("/employees", data);
	},

	async update(id: string, data: UpdateEmployeeDto): Promise<Employee> {
		return apiClient.put(`/employees/${id}`, data);
	},

	async delete(id: string): Promise<void> {
		return apiClient.delete(`/employees/${id}`);
	},

	async getFilters(): Promise<{
		countries: string[];
		departments: string[];
		jobTitles: string[];
	}> {
		return apiClient.get("/employees/filters");
	},
};
