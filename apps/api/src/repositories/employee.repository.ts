import type { Prisma } from "@prisma/client";
import type {
	CreateEmployeeDto,
	Employee,
	EmployeeFilters,
	PaginatedResponse,
	PaginationParams,
	UpdateEmployeeDto,
} from "@repo/types";
import { formatFullName } from "@repo/utils";
import { prisma } from "../config/database";

export class EmployeeRepository {
	async create(dto: CreateEmployeeDto): Promise<Employee> {
		const fullName = formatFullName(dto.firstName, dto.lastName);

		return prisma.employee.create({
			data: {
				...dto,
				fullName,
			},
		});
	}

	async findById(id: string): Promise<Employee | null> {
		return prisma.employee.findUnique({
			where: { id },
		});
	}

	async findByEmail(email: string): Promise<Employee | null> {
		return prisma.employee.findUnique({
			where: { email },
		});
	}

	async findAll(
		pagination: PaginationParams,
		filters?: EmployeeFilters,
	): Promise<PaginatedResponse<Employee>> {
		const {
			page,
			limit,
			sortBy = "createdAt",
			sortOrder = "desc",
		} = pagination;
		const skip = (page - 1) * limit;

		const where = this.buildWhereClause(filters);

		const [data, total] = await Promise.all([
			prisma.employee.findMany({
				where,
				skip,
				take: limit,
				orderBy: { [sortBy]: sortOrder },
			}),
			prisma.employee.count({ where }),
		]);

		const totalPages = Math.ceil(total / limit);

		return {
			data,
			meta: {
				total,
				page,
				limit,
				totalPages,
				hasNextPage: page < totalPages,
				hasPreviousPage: page > 1,
			},
		};
	}

	async update(id: string, dto: UpdateEmployeeDto): Promise<Employee> {
		const data: Prisma.EmployeeUpdateInput = { ...dto };

		if (dto.firstName || dto.lastName) {
			const employee = await this.findById(id);
			if (employee) {
				data.fullName = formatFullName(
					dto.firstName ?? employee.firstName,
					dto.lastName ?? employee.lastName,
				);
			}
		}

		return prisma.employee.update({
			where: { id },
			data,
		});
	}

	async delete(id: string): Promise<void> {
		await prisma.employee.delete({
			where: { id },
		});
	}

	async count(filters?: EmployeeFilters): Promise<number> {
		return prisma.employee.count({
			where: this.buildWhereClause(filters),
		});
	}

	async findByCountry(country: string): Promise<Employee[]> {
		return prisma.employee.findMany({
			where: { country },
		});
	}

	async findByDepartment(department: string): Promise<Employee[]> {
		return prisma.employee.findMany({
			where: { department },
		});
	}

	async findByJobTitle(jobTitle: string): Promise<Employee[]> {
		return prisma.employee.findMany({
			where: { jobTitle },
		});
	}

	async getDistinctCountries(): Promise<string[]> {
		const result = await prisma.employee.findMany({
			select: { country: true },
			distinct: ["country"],
		});
		return result.map((r) => r.country);
	}

	async getDistinctDepartments(): Promise<string[]> {
		const result = await prisma.employee.findMany({
			select: { department: true },
			distinct: ["department"],
		});
		return result.map((r) => r.department);
	}

	async getDistinctJobTitles(): Promise<string[]> {
		const result = await prisma.employee.findMany({
			select: { jobTitle: true },
			distinct: ["jobTitle"],
		});
		return result.map((r) => r.jobTitle);
	}

	private buildWhereClause(
		filters?: EmployeeFilters,
	): Prisma.EmployeeWhereInput {
		if (!filters) return {};

		const where: Prisma.EmployeeWhereInput = {};

		if (filters.search) {
			where.OR = [
				{ fullName: { contains: filters.search, mode: "insensitive" } },
				{ email: { contains: filters.search, mode: "insensitive" } },
				{ jobTitle: { contains: filters.search, mode: "insensitive" } },
				{ department: { contains: filters.search, mode: "insensitive" } },
			];
		}

		if (filters.country) {
			where.country = filters.country;
		}

		if (filters.department) {
			where.department = filters.department;
		}

		if (filters.jobTitle) {
			where.jobTitle = filters.jobTitle;
		}

		if (filters.employmentType) {
			where.employmentType = filters.employmentType;
		}

		if (filters.status) {
			where.status = filters.status;
		}

		if (filters.salaryBand) {
			where.salaryBand = filters.salaryBand;
		}

		if (filters.minSalary !== undefined || filters.maxSalary !== undefined) {
			where.salary = {};
			if (filters.minSalary !== undefined) {
				where.salary.gte = filters.minSalary;
			}
			if (filters.maxSalary !== undefined) {
				where.salary.lte = filters.maxSalary;
			}
		}

		return where;
	}
}
