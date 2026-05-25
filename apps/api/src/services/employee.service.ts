import { EmployeeRepository } from "../repositories/employee.repository";
import { NotFoundError, ConflictError } from "../middleware/error-handler";
import type {
	Employee,
	CreateEmployeeDto,
	UpdateEmployeeDto,
	PaginationParams,
	PaginatedResponse,
	EmployeeFilters,
} from "@repo/types";

export class EmployeeService {
	private repository: EmployeeRepository;

	constructor() {
		this.repository = new EmployeeRepository();
	}

	async create(dto: CreateEmployeeDto): Promise<Employee> {
		const existing = await this.repository.findByEmail(dto.email);
		if (existing) {
			throw new ConflictError("Employee with this email already exists");
		}

		return this.repository.create(dto);
	}

	async findById(id: string): Promise<Employee> {
		const employee = await this.repository.findById(id);
		if (!employee) {
			throw new NotFoundError("Employee not found");
		}
		return employee;
	}

	async findAll(
		pagination: PaginationParams,
		filters?: EmployeeFilters,
	): Promise<PaginatedResponse<Employee>> {
		return this.repository.findAll(pagination, filters);
	}

	async update(id: string, dto: UpdateEmployeeDto): Promise<Employee> {
		const existing = await this.repository.findById(id);
		if (!existing) {
			throw new NotFoundError("Employee not found");
		}

		if (dto.email && dto.email !== existing.email) {
			const emailExists = await this.repository.findByEmail(dto.email);
			if (emailExists) {
				throw new ConflictError("Employee with this email already exists");
			}
		}

		return this.repository.update(id, dto);
	}

	async delete(id: string): Promise<void> {
		const existing = await this.repository.findById(id);
		if (!existing) {
			throw new NotFoundError("Employee not found");
		}

		await this.repository.delete(id);
	}

	async getFilters(): Promise<{
		countries: string[];
		departments: string[];
		jobTitles: string[];
	}> {
		const [countries, departments, jobTitles] = await Promise.all([
			this.repository.getDistinctCountries(),
			this.repository.getDistinctDepartments(),
			this.repository.getDistinctJobTitles(),
		]);

		return {
			countries: countries.sort(),
			departments: departments.sort(),
			jobTitles: jobTitles.sort(),
		};
	}
}
