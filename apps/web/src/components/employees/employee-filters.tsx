import {
	Button,
	Label,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@repo/ui";
import { employeeService } from "@/services/employee.service";
import { EmployeeStatus, EmploymentType } from "@repo/types";
import type { EmployeeFilters as Filters } from "@repo/types";
import { useQuery } from "@tanstack/react-query";

interface EmployeeFiltersProps {
	filters: Filters;
	onFiltersChange: (filters: Filters) => void;
}

const EMPLOYEE_STATUS_OPTIONS = [
	EmployeeStatus.ACTIVE,
	EmployeeStatus.INACTIVE,
] as const;

export function EmployeeFilters({
	filters,
	onFiltersChange,
}: EmployeeFiltersProps) {
	const { data: filterOptions } = useQuery({
		queryKey: ["employee-filters"],
		queryFn: () => employeeService.getFilters(),
	});

	const handleFilterChange = (
		key: "country" | "department" | "employmentType" | "status",
		value: string | undefined,
	) => {
		const newFilters = { ...filters };

		// Remove the filter if value is empty string, "all" or undefined
		if (!value || value === "" || value === "all") {
			newFilters[key] = undefined;
		} else if (key === "employmentType") {
			newFilters.employmentType = value as EmploymentType;
		} else if (key === "status") {
			newFilters.status = value as EmployeeStatus;
		} else {
			newFilters[key] = value;
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
						value={filters.country || "all"}
						onValueChange={(value) => handleFilterChange("country", value)}
					>
						<SelectTrigger>
							<SelectValue placeholder="All countries" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All countries</SelectItem>
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
						value={filters.department || "all"}
						onValueChange={(value) => handleFilterChange("department", value)}
					>
						<SelectTrigger>
							<SelectValue placeholder="All departments" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All departments</SelectItem>
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
						value={filters.employmentType || "all"}
						onValueChange={(value) =>
							handleFilterChange("employmentType", value)
						}
					>
						<SelectTrigger>
							<SelectValue placeholder="All types" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All types</SelectItem>
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
						value={filters.status || "all"}
						onValueChange={(value) => handleFilterChange("status", value)}
					>
						<SelectTrigger>
							<SelectValue placeholder="All statuses" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All statuses</SelectItem>
							{EMPLOYEE_STATUS_OPTIONS.map((status) => (
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
