/**
 * Format date to locale string
 */
export function formatDate(date: Date | string, locale = "en-US"): string {
	const d = typeof date === "string" ? new Date(date) : date;
	return d.toLocaleDateString(locale, {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
}

/**
 * Format date to ISO string
 */
export function toISODate(date: Date | string): string {
	const d = typeof date === "string" ? new Date(date) : date;
	return d.toISOString().split("T")[0] ?? "";
}

/**
 * Calculate tenure in years
 */
export function calculateTenure(joiningDate: Date | string): number {
	const joining =
		typeof joiningDate === "string" ? new Date(joiningDate) : joiningDate;
	const now = new Date();
	const diffTime = Math.abs(now.getTime() - joining.getTime());
	const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);
	return Math.floor(diffYears * 10) / 10;
}

/**
 * Get relative time string
 */
export function getRelativeTime(date: Date | string, locale = "en-US"): string {
	const d = typeof date === "string" ? new Date(date) : date;
	const now = new Date();
	const diffMs = now.getTime() - d.getTime();
	const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

	if (diffDays === 0) return "Today";
	if (diffDays === 1) return "Yesterday";
	if (diffDays < 7) return `${diffDays} days ago`;
	if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
	if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
	return `${Math.floor(diffDays / 365)} years ago`;
}
