import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { employeeService } from "@/services/employee.service";
import { EmployeeTable } from "@/components/employees/employee-table";
import { EmployeeDialog } from "@/components/employees/employee-dialog";
import { EmployeeFilters } from "@/components/employees/employee-filters";
import { useToast } from "@/hooks/use-toast";
import type { Employee, EmployeeFilters as Filters } from "@repo/types";

export function EmployeesPage() {
	const [page, setPage] = useState(1);
	const [search, setSearch] = useState("");
	const [filters, setFilters] = useState<Filters>({});
	const [showFilters, setShowFilters] = useState(false);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
		null,
	);

	const queryClient = useQueryClient();
	const { toast } = useToast();

	const { data, isLoading } = useQuery({
		queryKey: ["employees", page, search, filters],
		queryFn: () =>
			employeeService.getAll(
				{ page, limit: 20, sortBy: "createdAt", sortOrder: "desc" },
				{ ...filters, search },
			),
	});

	const deleteMutation = useMutation({
		mutationFn: (id: string) => employeeService.delete(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["employees"] });
			toast({
				title: "Success",
				description: "Employee deleted successfully",
			});
		},
		onError: () => {
			toast({
				variant: "destructive",
				title: "Error",
				description: "Failed to delete employee",
			});
		},
	});

	const handleEdit = (employee: Employee) => {
		setSelectedEmployee(employee);
		setDialogOpen(true);
	};

	const handleDelete = (id: string) => {
		if (confirm("Are you sure you want to delete this employee?")) {
			deleteMutation.mutate(id);
		}
	};

	const handleDialogClose = () => {
		setDialogOpen(false);
		setSelectedEmployee(null);
	};

	return (
		<div className="space-y-6 animate-fade-in">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Employees</h1>
					<p className="text-muted-foreground">
						Manage your organization's employee records
					</p>
				</div>
				<Button onClick={() => setDialogOpen(true)}>
					<Plus className="mr-2 h-4 w-4" />
					Add Employee
				</Button>
			</div>

			<Card className="p-4">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							placeholder="Search employees..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className="pl-9"
						/>
					</div>
					<Button
						variant="outline"
						onClick={() => setShowFilters(!showFilters)}
						className="sm:w-auto"
					>
						<Filter className="mr-2 h-4 w-4" />
						Filters
					</Button>
				</div>

				{showFilters && (
					<div className="mt-4 border-t pt-4">
						<EmployeeFilters filters={filters} onFiltersChange={setFilters} />
					</div>
				)}
			</Card>

			<EmployeeTable
				data={data?.data ?? []}
				isLoading={isLoading}
				pagination={data?.meta}
				onPageChange={setPage}
				onEdit={handleEdit}
				onDelete={handleDelete}
			/>

			<EmployeeDialog
				open={dialogOpen}
				onClose={handleDialogClose}
				employee={selectedEmployee}
			/>
		</div>
	);
}
