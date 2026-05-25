/**
 * Currency symbols mapping
 */
export const CURRENCY_SYMBOLS: Record<string, string> = {
	USD: "$",
	EUR: "€",
	GBP: "£",
	JPY: "¥",
	INR: "₹",
	CAD: "C$",
	AUD: "A$",
	CHF: "CHF",
	CNY: "¥",
	SEK: "kr",
	NZD: "NZ$",
};

/**
 * Get currency symbol
 */
export function getCurrencySymbol(currency: string): string {
	return CURRENCY_SYMBOLS[currency] ?? currency;
}

/**
 * Convert currency (mock - in production use real exchange rates)
 */
export function convertCurrency(
	amount: number,
	fromCurrency: string,
	toCurrency: string,
): number {
	// Mock conversion rates - in production, use a real API
	const rates: Record<string, number> = {
		USD: 1,
		EUR: 0.92,
		GBP: 0.79,
		JPY: 149.5,
		INR: 83.12,
		CAD: 1.36,
		AUD: 1.52,
		CHF: 0.89,
		CNY: 7.24,
		SEK: 10.87,
		NZD: 1.65,
	};

	const fromRate = rates[fromCurrency] ?? 1;
	const toRate = rates[toCurrency] ?? 1;

	return (amount / fromRate) * toRate;
}
