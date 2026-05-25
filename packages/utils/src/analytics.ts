/**
 * Calculate median from array of numbers
 */
export function calculateMedian(numbers: number[]): number {
	if (numbers.length === 0) return 0;

	const sorted = [...numbers].sort((a, b) => a - b);
	const mid = Math.floor(sorted.length / 2);

	if (sorted.length % 2 === 0) {
		return ((sorted[mid - 1] ?? 0) + (sorted[mid] ?? 0)) / 2;
	}

	return sorted[mid] ?? 0;
}

/**
 * Calculate average from array of numbers
 */
export function calculateAverage(numbers: number[]): number {
	if (numbers.length === 0) return 0;
	const sum = numbers.reduce((acc, num) => acc + num, 0);
	return sum / numbers.length;
}

/**
 * Calculate percentage
 */
export function calculatePercentage(value: number, total: number): number {
	if (total === 0) return 0;
	return Math.round((value / total) * 100 * 100) / 100;
}

/**
 * Group array by key
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
	return array.reduce(
		(result, item) => {
			const groupKey = String(item[key]);
			if (!result[groupKey]) {
				result[groupKey] = [];
			}
			result[groupKey]?.push(item);
			return result;
		},
		{} as Record<string, T[]>,
	);
}

/**
 * Calculate percentile
 */
export function calculatePercentile(
	numbers: number[],
	percentile: number,
): number {
	if (numbers.length === 0) return 0;

	const sorted = [...numbers].sort((a, b) => a - b);
	const index = (percentile / 100) * (sorted.length - 1);
	const lower = Math.floor(index);
	const upper = Math.ceil(index);
	const weight = index - lower;

	if (lower === upper) {
		return sorted[lower] ?? 0;
	}

	return (sorted[lower] ?? 0) * (1 - weight) + (sorted[upper] ?? 0) * weight;
}

/**
 * Create salary distribution buckets
 */
export function createSalaryBuckets(
	salaries: number[],
	bucketCount = 10,
): Array<{ min: number; max: number; count: number }> {
	if (salaries.length === 0) return [];

	const min = Math.min(...salaries);
	const max = Math.max(...salaries);
	const bucketSize = (max - min) / bucketCount;

	const buckets = Array.from({ length: bucketCount }, (_, i) => ({
		min: min + i * bucketSize,
		max: min + (i + 1) * bucketSize,
		count: 0,
	}));

	for (const salary of salaries) {
		const bucketIndex = Math.min(
			Math.floor((salary - min) / bucketSize),
			bucketCount - 1,
		);
		const bucket = buckets[bucketIndex];
		if (bucket) {
			bucket.count++;
		}
	}

	return buckets;
}
