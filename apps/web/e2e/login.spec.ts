import { expect, test } from "@playwright/test";

test.describe("Login Page", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/login");
	});

	test("should display login form", async ({ page }) => {
		await expect(page.getByRole("heading", { name: /welcome/i })).toBeVisible();
		await expect(page.getByLabel(/email/i)).toBeVisible();
		await expect(page.getByLabel(/password/i)).toBeVisible();
		await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();
	});

	test("should show validation errors for empty fields", async ({ page }) => {
		await page.getByRole("button", { name: /sign in/i }).click();

		// Check for validation messages
		await expect(page.getByText(/invalid email/i)).toBeVisible();
	});

	test("should show error for invalid credentials", async ({ page }) => {
		await page.getByLabel(/email/i).fill("invalid@test.com");
		await page.getByLabel(/password/i).fill("wrongpassword");
		await page.getByRole("button", { name: /sign in/i }).click();

		// Wait for error message
		await expect(page.getByText(/invalid credentials/i)).toBeVisible();
	});

	test("should navigate to dashboard on successful login", async ({ page }) => {
		// Fill in valid credentials
		await page.getByLabel(/email/i).fill("admin@company.com");
		await page.getByLabel(/password/i).fill("password123");
		await page.getByRole("button", { name: /sign in/i }).click();

		// Should redirect to dashboard
		await expect(page).toHaveURL("/dashboard");
		await expect(
			page.getByRole("heading", { name: /dashboard/i }),
		).toBeVisible();
	});

	test("should be responsive", async ({ page }) => {
		// Test mobile viewport
		await page.setViewportSize({ width: 375, height: 667 });
		await expect(page.getByRole("heading", { name: /welcome/i })).toBeVisible();

		// Test tablet viewport
		await page.setViewportSize({ width: 768, height: 1024 });
		await expect(page.getByRole("heading", { name: /welcome/i })).toBeVisible();
	});
});
