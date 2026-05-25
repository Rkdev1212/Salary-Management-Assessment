import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { employeeService } from "@/services/employee.service";
import { EmployeeStatus, EmploymentType } from "@repo/types";
import type { EmployeeFilters as Filters } from "@repo/types";
import { useQuery } from "@tanstack/react-query";

interface EmployeeFiltersProps {
	filters: Filters;
	onFiltersChange: (filters: Filters) => void;
}

export function EmployeeFilters({
	filters,
	onFiltersChange,
}: EmployeeFiltersProps) {
	const { data: filterOptions } = useQuery({
		queryKey: ["employee-filters"],
		queryFn: () => employeeService.getFilters(),
	});

	const handleFilterChange = (
		key: keyof Filters,
		value: string | undefined,
	) => {
		const newFilters = { ...filters };

		// Remove the filter if value is empty string or undefined
		if (!value || value === "") {
			delete newFilters[key];
		} else {
			newFilters[key] = value as any;
		}

		onFiltersChange(newFilters);
	};

	const clearFilters = () => {
		onFiltersChange({});
	};

	return (
		<div className="space-y-4">
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<div className="space-y-2">
					<Label>Country</Label>
					<Select
						value={filters.country || ""}
						onValueChange={(value) => handleFilterChange("country", value)}
					>
						<SelectTrigger>
							<SelectValue placeholder="All countries" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="">All countries</SelectItem>
							{filterOptions?.countries.map((country) => (
								<SelectItem key={country} value={country}>
									{country}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className="space-y-2">
					<Label>Department</Label>
					<Select
						value={filters.department || ""}
						onValueChange={(value) => handleFilterChange("department", value)}
					>
						<SelectTrigger>
							<SelectValue placeholder="All departments" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="">All departments</SelectItem>
							{filterOptions?.departments.map((dept) => (
								<SelectItem key={dept} value={dept}>
									{dept}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className="space-y-2">
					<Label>Employment Type</Label>
					<Select
						value={filters.employmentType || ""}
						onValueChange={(value) =>
							handleFilterChange("employmentType", value)
						}
					>
						<SelectTrigger>
							<SelectValue placeholder="All types" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="">All types</SelectItem>
							{Object.values(EmploymentType).map((type) => (
								<SelectItem key={type} value={type}>
									{type.replace("_", " ")}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className="space-y-2">
					<Label>Status</Label>
					<Select
						value={filters.status || ""}
						onValueChange={(value) => handleFilterChange("status", value)}
					>
						<SelectTrigger>
							<SelectValue placeholder="All statuses" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="">All statuses</SelectItem>
							{Object.values(EmployeeStatus).map((status) => (
								<SelectItem key={status} value={status}>
									{status.replace("_", " ")}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>

			<div className="flex justify-end">
				<Button variant="outline" size="sm" onClick={clearFilters}>
					Clear Filters
				</Button>
			</div>
		</div>
	);
}
