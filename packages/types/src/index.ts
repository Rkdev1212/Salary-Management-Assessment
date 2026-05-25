// Employee Types
export enum EmploymentType {
	FULL_TIME = "FULL_TIME",
	PART_TIME = "PART_TIME",
	CONTRACT = "CONTRACT",
	INTERN = "INTERN",
}

export enum EmployeeStatus {
	ACTIVE = "ACTIVE",
	INACTIVE = "INACTIVE",
	ON_LEAVE = "ON_LEAVE",
	TERMINATED = "TERMINATED",
}

export enum SalaryBand {
	JUNIOR = "JUNIOR",
	MID = "MID",
	SENIOR = "SENIOR",
	LEAD = "LEAD",
	PRINCIPAL = "PRINCIPAL",
}

export interface Employee {
	id: string;
	firstName: string;
	lastName: string;
	fullName: string;
	email: string;
	phone: string;
	country: string;
	currency: string;
	salary: number;
	department: string;
	jobTitle: string;
	employmentType: EmploymentType;
	joiningDate: Date;
	status: EmployeeStatus;
	managerName: string | null;
	performanceRating: number | null;
	salaryBand: SalaryBand;
	bonusEligible: boolean;
	location: string;
	timezone: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface CreateEmployeeDto {
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	country: string;
	currency: string;
	salary: number;
	department: string;
	jobTitle: string;
	employmentType: EmploymentType;
	joiningDate: Date;
	status: EmployeeStatus;
	managerName?: string | null;
	performanceRating?: number | null;
	salaryBand: SalaryBand;
	bonusEligible: boolean;
	location: string;
	timezone: string;
}

export interface UpdateEmployeeDto extends Partial<CreateEmployeeDto> {}

// Pagination Types
export interface PaginationParams {
	page: number;
	limit: number;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
	data: T[];
	meta: {
		total: number;
		page: number;
		limit: number;
		totalPages: number;
		hasNextPage: boolean;
		hasPreviousPage: boolean;
	};
}

// Filter Types
export interface EmployeeFilters {
	search?: string;
	country?: string;
	department?: string;
	jobTitle?: string;
	employmentType?: EmploymentType;
	status?: EmployeeStatus;
	salaryBand?: SalaryBand;
	minSalary?: number;
	maxSalary?: number;
}

// Analytics Types
export interface CountrySalaryStats {
	country: string;
	minSalary: number;
	maxSalary: number;
	avgSalary: number;
	medianSalary: number;
	employeeCount: number;
	currency: string;
}

export interface JobTitleSalaryStats {
	jobTitle: string;
	country: string;
	avgSalary: number;
	minSalary: number;
	maxSalary: number;
	employeeCount: number;
	currency: string;
}

export interface DepartmentStats {
	department: string;
	avgSalary: number;
	employeeCount: number;
	totalCompensation: number;
}

export interface SalaryDistribution {
	range: string;
	count: number;
	percentage: number;
}

export interface HiringTrend {
	month: string;
	year: number;
	hireCount: number;
}

export interface AnalyticsDashboard {
	countrySalaryStats: CountrySalaryStats[];
	jobTitleSalaryStats: JobTitleSalaryStats[];
	departmentStats: DepartmentStats[];
	salaryDistribution: SalaryDistribution[];
	hiringTrends: HiringTrend[];
	totalEmployees: number;
	activeEmployees: number;
	inactiveEmployees: number;
	avgCompanyWideSalary: number;
	medianCompanyWideSalary: number;
	topPayingDepartments: DepartmentStats[];
}

// Auth Types
export interface LoginDto {
	email: string;
	password: string;
}

export interface RegisterDto {
	email: string;
	password: string;
	firstName: string;
	lastName: string;
}

export interface AuthTokens {
	accessToken: string;
	refreshToken: string;
}

export interface AuthUser {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	role: string;
}

export interface AuthResponse {
	user: AuthUser;
	tokens: AuthTokens;
}

// API Response Types
export interface ApiResponse<T = unknown> {
	success: boolean;
	data?: T;
	message?: string;
	error?: string;
}

export interface ApiError {
	statusCode: number;
	message: string;
	error: string;
	timestamp: string;
	path: string;
}
