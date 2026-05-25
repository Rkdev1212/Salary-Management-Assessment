import * as fs from "node:fs";
import * as path from "node:path";
import { faker } from "@faker-js/faker";
import { EmployeeStatus, EmploymentType, SalaryBand } from "@repo/types";
import { formatFullName } from "@repo/utils";
import { prisma } from "../config/database";
import { logger } from "../config/logger";

const BATCH_SIZE = 500;
const TOTAL_EMPLOYEES = 10000;

const countries = [
	{ name: "United States", currency: "USD", timezone: "America/New_York" },
	{ name: "United Kingdom", currency: "GBP", timezone: "Europe/London" },
	{ name: "Germany", currency: "EUR", timezone: "Europe/Berlin" },
	{ name: "India", currency: "INR", timezone: "Asia/Kolkata" },
	{ name: "Canada", currency: "CAD", timezone: "America/Toronto" },
	{ name: "Australia", currency: "AUD", timezone: "Australia/Sydney" },
	{ name: "Japan", currency: "JPY", timezone: "Asia/Tokyo" },
	{ name: "France", currency: "EUR", timezone: "Europe/Paris" },
	{ name: "Singapore", currency: "SGD", timezone: "Asia/Singapore" },
	{ name: "Netherlands", currency: "EUR", timezone: "Europe/Amsterdam" },
];

const departments = [
	"Engineering",
	"Product",
	"Design",
	"Marketing",
	"Sales",
	"Customer Success",
	"Human Resources",
	"Finance",
	"Operations",
	"Legal",
];

const jobTitles = [
	"Software Engineer",
	"Senior Software Engineer",
	"Staff Engineer",
	"Principal Engineer",
	"Engineering Manager",
	"Product Manager",
	"Senior Product Manager",
	"Product Designer",
	"UX Researcher",
	"Marketing Manager",
	"Sales Representative",
	"Account Executive",
	"Customer Success Manager",
	"HR Manager",
	"Financial Analyst",
	"Operations Manager",
	"Legal Counsel",
];

const salaryRanges: Record<SalaryBand, { min: number; max: number }> = {
	[SalaryBand.JUNIOR]: { min: 50000, max: 80000 },
	[SalaryBand.MID]: { min: 80000, max: 120000 },
	[SalaryBand.SENIOR]: { min: 120000, max: 180000 },
	[SalaryBand.LEAD]: { min: 180000, max: 250000 },
	[SalaryBand.PRINCIPAL]: { min: 250000, max: 400000 },
};

function loadNames(filename: string): string[] {
	try {
		const filePath = path.join(__dirname, filename);
		const content = fs.readFileSync(filePath, "utf-8");
		return content.split("\n").filter((name) => name.trim().length > 0);
	} catch {
		logger.warn(`Could not load ${filename}, using faker instead`);
		return [];
	}
}

function generateEmployee(
	index: number,
	firstNames: string[],
	lastNames: string[],
) {
	const firstName =
		firstNames.length > 0
			? (firstNames[index % firstNames.length] ?? faker.person.firstName())
			: faker.person.firstName();

	const lastName =
		lastNames.length > 0
			? (lastNames[Math.floor(index / firstNames.length) % lastNames.length] ??
				faker.person.lastName())
			: faker.person.lastName();

	const fullName = formatFullName(firstName, lastName);
	const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${index}@company.com`;

	const country = faker.helpers.arrayElement(countries);
	const department = faker.helpers.arrayElement(departments);
	const jobTitle = faker.helpers.arrayElement(jobTitles);
	const salaryBand = faker.helpers.arrayElement(Object.values(SalaryBand));
	const salaryRange = salaryRanges[salaryBand];
	const salary = faker.number.int({
		min: salaryRange.min,
		max: salaryRange.max,
	});

	return {
		firstName,
		lastName,
		fullName,
		email,
		phone: faker.phone.number(),
		country: country.name,
		currency: country.currency,
		salary,
		department,
		jobTitle,
		employmentType: faker.helpers.arrayElement(Object.values(EmploymentType)),
		joiningDate: faker.date.between({
			from: new Date("2020-01-01"),
			to: new Date(),
		}),
		status: faker.helpers.weightedArrayElement([
			{ value: EmployeeStatus.ACTIVE, weight: 85 },
			{ value: EmployeeStatus.INACTIVE, weight: 5 },
			{ value: EmployeeStatus.ON_LEAVE, weight: 5 },
			{ value: EmployeeStatus.TERMINATED, weight: 5 },
		]),
		managerName: faker.datatype.boolean() ? faker.person.fullName() : null,
		performanceRating: faker.datatype.boolean()
			? faker.number.float({ min: 1, max: 5, fractionDigits: 1 })
			: null,
		salaryBand,
		bonusEligible: faker.datatype.boolean(),
		location: `${faker.location.city()}, ${country.name}`,
		timezone: country.timezone,
	};
}

async function seed(): Promise<void> {
	const startTime = Date.now();
	logger.info("Starting seed process...");

	try {
		// Clear existing data
		logger.info("Clearing existing employees...");
		await prisma.employee.deleteMany();

		// Load names from files
		const firstNames = loadNames("first_names.txt");
		const lastNames = loadNames("last_names.txt");

		logger.info(
			`Loaded ${firstNames.length} first names and ${lastNames.length} last names`,
		);

		// Generate and insert employees in batches
		const batches = Math.ceil(TOTAL_EMPLOYEES / BATCH_SIZE);

		for (let batch = 0; batch < batches; batch++) {
			const batchStart = batch * BATCH_SIZE;
			const batchEnd = Math.min(batchStart + BATCH_SIZE, TOTAL_EMPLOYEES);
			const batchSize = batchEnd - batchStart;

			const employees = Array.from({ length: batchSize }, (_, i) =>
				generateEmployee(batchStart + i, firstNames, lastNames),
			);

			await prisma.employee.createMany({
				data: employees,
				skipDuplicates: true,
			});

			logger.info(
				`Inserted batch ${batch + 1}/${batches} (${batchEnd}/${TOTAL_EMPLOYEES})`,
			);
		}

		const duration = ((Date.now() - startTime) / 1000).toFixed(2);
		logger.info(`Seed completed successfully in ${duration}s`);
		logger.info(`Total employees created: ${TOTAL_EMPLOYEES}`);

		// Log statistics
		const stats = await prisma.employee.groupBy({
			by: ["country"],
			_count: true,
		});

		logger.info("Employee distribution by country:");
		for (const stat of stats) {
			logger.info(`  ${stat.country}: ${stat._count}`);
		}
		// Create default admin user
		const bcrypt = await import("bcrypt");
		const hashedPassword = await bcrypt.hash("password123", 12);

		await prisma.user.upsert({
			where: { email: "admin@company.com" },
			update: {},
			create: {
				email: "admin@company.com",
				password: hashedPassword,
				firstName: "Admin",
				lastName: "User",
				role: "HR_MANAGER",
			},
		});

		logger.info("Default admin user created:");
		logger.info("  Email: admin@company.com");
		logger.info("  Password: password123");
	} catch (error) {
		logger.error("Seed failed", error);
		throw error;
	} finally {
		await prisma.$disconnect();
	}
}

seed();
