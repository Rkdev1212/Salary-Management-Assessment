/**
 * Format a number as currency
 */
export function formatCurrency(
	amount: number,
	currency: string,
	locale = "en-US",
): string {
	return new Intl.NumberFormat(locale, {
		style: "currency",
		currency,
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(amount);
}

/**
 * Format a number with thousand separators
 */
export function formatNumber(value: number, locale = "en-US"): string {
	return new Intl.NumberFormat(locale).format(value);
}

/**
 * Format full name from first and last name
 */
export function formatFullName(firstName: string, lastName: string): string {
	return `${firstName} ${lastName}`.trim();
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
	if (text.length <= maxLength) return text;
	return `${text.slice(0, maxLength)}...`;
}

/**
 * Format phone number
 */
export function formatPhoneNumber(phone: string): string {
	const cleaned = phone.replace(/\D/g, "");
	const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
	if (match) {
		return `(${match[1]}) ${match[2]}-${match[3]}`;
	}
	return phone;
}

/**
 * Get initials from name
 */
export function getInitials(firstName: string, lastName: string): string {
	return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}
