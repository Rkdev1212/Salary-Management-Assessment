import { expect, test } from "@playwright/test";

test.describe("Dashboard", () => {
	test.beforeEach(async ({ page }) => {
		// Login first
		await page.goto("http://localhost:3000/login");
		await page.fill('input[type="email"]', "admin@company.com");
		await page.fill('input[type="password"]', "password123");
		await page.click('button[type="submit"]');
		await page.waitForURL("**/dashboard");
	});

	test("displays dashboard page", async ({ page }) => {
		await expect(page.locator("h1")).toContainText("Dashboard");
	});

	test("shows analytics cards", async ({ page }) => {
		// Wait for data to load
		await page.waitForTimeout(1000);

		// Check for stat cards
		await expect(page.getByText("Total Employees")).toBeVisible();
		await expect(page.getByText("Avg Salary")).toBeVisible();
		await expect(page.getByText("Median Salary")).toBeVisible();
		await expect(page.getByText("Departments")).toBeVisible();
	});

	test("displays charts", async ({ page }) => {
		// Wait for charts to render
		await page.waitForTimeout(1500);

		// Check for chart titles
		await expect(page.getByText("Salary by Country")).toBeVisible();
		await expect(page.getByText("Employee Distribution")).toBeVisible();
		await expect(page.getByText("Hiring Trends")).toBeVisible();
		await expect(page.getByText("Top Paying Departments")).toBeVisible();
	});

	test("navigates to employees page", async ({ page }) => {
		await page.click('a[href="/employees"]');
		await page.waitForURL("**/employees");
		await expect(page.locator("h1")).toContainText("Employees");
	});

	test("can logout from dashboard", async ({ page }) => {
		await page.click('button:has-text("Logout")');
		await page.waitForURL("**/login");
		await expect(page.locator("h1")).toContainText("Welcome Back");
	});
});
