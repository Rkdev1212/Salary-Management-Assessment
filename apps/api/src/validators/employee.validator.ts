import { z } from "zod";
import { EmploymentType, EmployeeStatus, SalaryBand } from "@repo/types";

export const createEmployeeSchema = z.object({
	firstName: z.string().min(1).max(100),
	lastName: z.string().min(1).max(100),
	email: z.string().email(),
	phone: z.string().min(10).max(20),
	country: z.string().min(2).max(100),
	currency: z.string().length(3),
	salary: z.number().positive().max(10000000),
	department: z.string().min(1).max(100),
	jobTitle: z.string().min(1).max(100),
	employmentType: z.nativeEnum(EmploymentType),
	joiningDate: z.coerce.date(),
	status: z.nativeEnum(EmployeeStatus).default(EmployeeStatus.ACTIVE),
	managerName: z.string().max(200).nullable().optional(),
	performanceRating: z.number().min(1).max(5).nullable().optional(),
	salaryBand: z.nativeEnum(SalaryBand),
	bonusEligible: z.boolean().default(false),
	location: z.string().min(1).max(200),
	timezone: z.string().min(1).max(100),
});

export const updateEmployeeSchema = createEmployeeSchema.partial();

export const paginationSchema = z.object({
	page: z.coerce.number().int().positive().default(1),
	limit: z.coerce.number().int().positive().max(100).default(20),
	sortBy: z.string().optional(),
	sortOrder: z.enum(["asc", "desc"]).optional(),
});

export const employeeFiltersSchema = z.object({
	search: z.string().optional(),
	country: z.string().optional(),
	department: z.string().optional(),
	jobTitle: z.string().optional(),
	employmentType: z.nativeEnum(EmploymentType).optional(),
	status: z.nativeEnum(EmployeeStatus).optional(),
	salaryBand: z.nativeEnum(SalaryBand).optional(),
	minSalary: z.coerce.number().optional(),
	maxSalary: z.coerce.number().optional(),
});

export const idParamSchema = z.object({
	id: z.string().cuid(),
});
