/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

/**
 * Validate phone number
 */
export function isValidPhone(phone: string): boolean {
	const phoneRegex = /^\+?[\d\s-()]+$/;
	return phoneRegex.test(phone) && phone.replace(/\D/g, "").length >= 10;
}

/**
 * Validate salary range
 */
export function isValidSalary(salary: number): boolean {
	return salary > 0 && salary <= 10000000;
}

/**
 * Validate performance rating (1-5)
 */
export function isValidPerformanceRating(rating: number): boolean {
	return rating >= 1 && rating <= 5;
}

/**
 * Sanitize string input
 */
export function sanitizeString(input: string): string {
	return input.trim().replace(/[<>]/g, "");
}
