import { expect, test } from "@playwright/test";

test.describe("Employees Page", () => {
	test.beforeEach(async ({ page }) => {
		// Login first
		await page.goto("/login");
		await page.getByLabel(/email/i).fill("admin@company.com");
		await page.getByLabel(/password/i).fill("password123");
		await page.getByRole("button", { name: /sign in/i }).click();

		// Navigate to employees page
		await page.goto("/employees");
	});

	test("should display employees list", async ({ page }) => {
		await expect(
			page.getByRole("heading", { name: /employees/i }),
		).toBeVisible();
		await expect(
			page.getByRole("button", { name: /add employee/i }),
		).toBeVisible();
	});

	test("should open add employee dialog", async ({ page }) => {
		await page.getByRole("button", { name: /add employee/i }).click();

		await expect(page.getByRole("dialog")).toBeVisible();
		await expect(page.getByText(/add employee/i)).toBeVisible();
	});

	test("should search employees", async ({ page }) => {
		const searchInput = page.getByPlaceholder(/search employees/i);
		await searchInput.fill("John");

		// Wait for search results
		await page.waitForTimeout(500);

		// Results should be filtered
		await expect(page.getByRole("table")).toBeVisible();
	});

	test("should filter employees", async ({ page }) => {
		await page.getByRole("button", { name: /filters/i }).click();

		// Filter options should be visible
		await expect(page.getByText(/country/i)).toBeVisible();
		await expect(page.getByText(/department/i)).toBeVisible();
	});

	test("should paginate results", async ({ page }) => {
		// Check if pagination exists
		const nextButton = page.getByRole("button", { name: /next/i });

		if (await nextButton.isVisible()) {
			await nextButton.click();
			await page.waitForTimeout(500);

			// Should load next page
			await expect(page.getByRole("table")).toBeVisible();
		}
	});
});
