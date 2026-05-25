import type {
	AnalyticsDashboard,
	CountrySalaryStats,
	DepartmentStats,
	EmployeeStatus,
	HiringTrend,
	JobTitleSalaryStats,
	SalaryDistribution,
} from "@repo/types";
import { calculateAverage, calculateMedian, groupBy } from "@repo/utils";
import { prisma } from "../config/database";

export class AnalyticsService {
	async getDashboard(): Promise<AnalyticsDashboard> {
		const [
			employees,
			countrySalaryStats,
			jobTitleSalaryStats,
			departmentStats,
			salaryDistribution,
			hiringTrends,
		] = await Promise.all([
			prisma.employee.findMany(),
			this.getCountrySalaryStats(),
			this.getJobTitleSalaryStats(),
			this.getDepartmentStats(),
			this.getSalaryDistribution(),
			this.getHiringTrends(),
		]);

		const activeEmployees = employees.filter(
			(e) => e.status === "ACTIVE",
		).length;
		const inactiveEmployees = employees.length - activeEmployees;

		const allSalaries = employees.map((e) => e.salary);
		const avgCompanyWideSalary = calculateAverage(allSalaries);
		const medianCompanyWideSalary = calculateMedian(allSalaries);

		const topPayingDepartments = [...departmentStats]
			.sort((a, b) => b.avgSalary - a.avgSalary)
			.slice(0, 5);

		return {
			countrySalaryStats,
			jobTitleSalaryStats,
			departmentStats,
			salaryDistribution,
			hiringTrends,
			totalEmployees: employees.length,
			activeEmployees,
			inactiveEmployees,
			avgCompanyWideSalary,
			medianCompanyWideSalary,
			topPayingDepartments,
		};
	}

	async getCountrySalaryStats(): Promise<CountrySalaryStats[]> {
		const employees = await prisma.employee.findMany({
			select: {
				country: true,
				salary: true,
				currency: true,
			},
		});

		const grouped = groupBy(employees, "country");

		return Object.entries(grouped).map(([country, countryEmployees]) => {
			const salaries = countryEmployees.map((e) => e.salary);
			const currency = countryEmployees[0]?.currency ?? "USD";

			return {
				country,
				minSalary: Math.min(...salaries),
				maxSalary: Math.max(...salaries),
				avgSalary: Math.round(calculateAverage(salaries)),
				medianSalary: Math.round(calculateMedian(salaries)),
				employeeCount: countryEmployees.length,
				currency,
			};
		});
	}

	async getJobTitleSalaryStats(): Promise<JobTitleSalaryStats[]> {
		const employees = await prisma.employee.findMany({
			select: {
				jobTitle: true,
				country: true,
				salary: true,
				currency: true,
			},
		});

		const grouped: Record<string, typeof employees> = {};

		for (const emp of employees) {
			const key = `${emp.jobTitle}|${emp.country}`;
			if (!grouped[key]) {
				grouped[key] = [];
			}
			grouped[key]?.push(emp);
		}

		return Object.entries(grouped).map(([key, jobEmployees]) => {
			const [jobTitle, country] = key.split("|") as [string, string];
			const salaries = jobEmployees.map((e) => e.salary);
			const currency = jobEmployees[0]?.currency ?? "USD";

			return {
				jobTitle,
				country,
				avgSalary: Math.round(calculateAverage(salaries)),
				minSalary: Math.min(...salaries),
				maxSalary: Math.max(...salaries),
				employeeCount: jobEmployees.length,
				currency,
			};
		});
	}

	async getDepartmentStats(): Promise<DepartmentStats[]> {
		const employees = await prisma.employee.findMany({
			select: {
				department: true,
				salary: true,
			},
		});

		const grouped = groupBy(employees, "department");

		return Object.entries(grouped).map(([department, deptEmployees]) => {
			const salaries = deptEmployees.map((e) => e.salary);
			const totalCompensation = salaries.reduce(
				(sum, salary) => sum + salary,
				0,
			);

			return {
				department,
				avgSalary: Math.round(calculateAverage(salaries)),
				employeeCount: deptEmployees.length,
				totalCompensation: Math.round(totalCompensation),
			};
		});
	}

	async getSalaryDistribution(): Promise<SalaryDistribution[]> {
		const employees = await prisma.employee.findMany({
			select: { salary: true },
		});

		const salaries = employees.map((e) => e.salary);
		const min = Math.min(...salaries);
		const max = Math.max(...salaries);
		const bucketSize = (max - min) / 10;

		const buckets: SalaryDistribution[] = Array.from({ length: 10 }, (_, i) => {
			const rangeMin = Math.round(min + i * bucketSize);
			const rangeMax = Math.round(min + (i + 1) * bucketSize);
			return {
				range: `${rangeMin}-${rangeMax}`,
				count: 0,
				percentage: 0,
			};
		});

		for (const salary of salaries) {
			const bucketIndex = Math.min(Math.floor((salary - min) / bucketSize), 9);
			const bucket = buckets[bucketIndex];
			if (bucket) {
				bucket.count++;
			}
		}

		for (const bucket of buckets) {
			bucket.percentage =
				Math.round((bucket.count / salaries.length) * 100 * 100) / 100;
		}

		return buckets;
	}

	async getHiringTrends(): Promise<HiringTrend[]> {
		const employees = await prisma.employee.findMany({
			select: { joiningDate: true },
		});

		const grouped: Record<string, number> = {};

		for (const emp of employees) {
			const date = new Date(emp.joiningDate);
			const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
			grouped[key] = (grouped[key] ?? 0) + 1;
		}

		return Object.entries(grouped)
			.map(([key, count]) => {
				const [year, month] = key.split("-");
				return {
					month: new Date(Number(year), Number(month) - 1).toLocaleString(
						"default",
						{
							month: "short",
						},
					),
					year: Number(year),
					hireCount: count,
				};
			})
			.sort((a, b) => {
				if (a.year !== b.year) return a.year - b.year;
				return (
					new Date(`${a.month} 1`).getMonth() -
					new Date(`${b.month} 1`).getMonth()
				);
			});
	}

	async getEmployeeCountByStatus(): Promise<Record<EmployeeStatus, number>> {
		const result = await prisma.employee.groupBy({
			by: ["status"],
			_count: true,
		});

		const counts: Record<string, number> = {};
		for (const r of result) {
			counts[r.status] = r._count;
		}

		return counts as Record<EmployeeStatus, number>;
	}
}
