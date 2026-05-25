import { EmployeeDialog } from "@/components/employees/employee-dialog";
import { EmployeeFilters } from "@/components/employees/employee-filters";
import { EmployeeTable } from "@/components/employees/employee-table";
import { useToast } from "@/hooks/use-toast";
import { employeeService } from "@/services/employee.service";
import type { Employee, EmployeeFilters as Filters } from "@repo/types";
import { EmployeeStatus } from "@repo/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

const STATUS_FILTERS = [
	{ label: "All statuses", value: "" },
	{ label: "Active", value: EmployeeStatus.ACTIVE },
	{ label: "Inactive", value: EmployeeStatus.INACTIVE },
] as const;

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
		queryFn: () => {
			const cleanFilters = { ...filters };
			if (search) cleanFilters.search = search;
			return employeeService.getAll(
				{ page, limit: 20, sortBy: "createdAt", sortOrder: "desc" },
				cleanFilters,
			);
		},
	});

	const deleteMutation = useMutation({
		mutationFn: (id: string) => employeeService.delete(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["employees"] });
			toast({ title: "Success", description: "Employee deleted successfully" });
		},
		onError: () => {
			toast({
				variant: "destructive",
				title: "Error",
				description: "Failed to delete employee",
			});
		},
	});

	const toggleStatusMutation = useMutation({
		mutationFn: ({ id, status }: { id: string; status: EmployeeStatus }) =>
			employeeService.update(id, {
				status:
					status === EmployeeStatus.ACTIVE
						? EmployeeStatus.INACTIVE
						: EmployeeStatus.ACTIVE,
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["employees"] });
			toast({
				title: "Success",
				description: "Employee status updated successfully",
			});
		},
		onError: () => {
			toast({
				variant: "destructive",
				title: "Error",
				description: "Failed to update employee status",
			});
		},
	});

	const handleEdit = (employee: Employee) => {
		setSelectedEmployee(employee);
		setDialogOpen(true);
	};

	const handleDelete = (id: string) => deleteMutation.mutate(id);

	const handleToggleStatus = (id: string, currentStatus: EmployeeStatus) =>
		toggleStatusMutation.mutate({ id, status: currentStatus });

	const handleDialogClose = () => {
		setDialogOpen(false);
		setSelectedEmployee(null);
	};

	const handleFiltersChange = (newFilters: Filters) => {
		setFilters(newFilters);
		setPage(1);
	};

	const handleStatusFilterChange = (status: EmployeeStatus | undefined) => {
		setFilters((currentFilters) => {
			const nextFilters = { ...currentFilters };

			if (status) {
				nextFilters.status = status;
			} else {
				nextFilters.status = undefined;
			}

			return nextFilters;
		});
		setPage(1);
	};

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				gap: 24,
				fontFamily: "'Segoe UI', system-ui, sans-serif",
			}}
		>
			{/* ── Page header ── */}
			<div>
				<h1
					style={{
						fontSize: "1.5rem",
						fontWeight: 700,
						color: "#0f172a",
						margin: "0 0 4px",
					}}
				>
					Employees
				</h1>
				{/* Breadcrumb */}
				{/* <p style={{ fontSize: "0.82rem", color: "#94a3b8", margin: 0 }}>
					<span style={{ color: "#64748b" }}>Organization</span>
					<span style={{ margin: "0 6px" }}>/</span>
					<span style={{ color: "#1a7fd4", fontWeight: 500 }}>Employees</span>
				</p> */}
			</div>

			{/* ── Section header with subtitle + CTA ── */}
			<div
				style={{
					display: "flex",
					alignItems: "flex-start",
					justifyContent: "space-between",
					gap: 16,
					flexWrap: "wrap",
				}}
			>
				<div>
					<h2
						style={{
							fontSize: "1.1rem",
							fontWeight: 700,
							color: "#0f172a",
							margin: "0 0 4px",
						}}
					>
						{filters.status === EmployeeStatus.ACTIVE
							? "Active Employees"
							: filters.status === EmployeeStatus.INACTIVE
								? "Inactive Employees"
								: "All Employees"}
					</h2>
					<p style={{ fontSize: "0.85rem", color: "#94a3b8", margin: 0 }}>
						Manage your organization's employee records and access.
					</p>
				</div>

				<button
					type="button"
					onClick={() => setDialogOpen(true)}
					style={{
						display: "flex",
						alignItems: "center",
						gap: 8,
						padding: "9px 20px",
						borderRadius: 10,
						background: "linear-gradient(135deg,#3b9eff,#1a7fd4)",
						color: "#fff",
						border: "none",
						fontWeight: 600,
						fontSize: "0.88rem",
						cursor: "pointer",
						boxShadow: "0 3px 10px rgba(26,127,212,0.28)",
						transition: "opacity 0.15s",
						fontFamily: "inherit",
					}}
					onMouseEnter={(e) => {
						(e.currentTarget as HTMLElement).style.opacity = "0.9";
					}}
					onMouseLeave={(e) => {
						(e.currentTarget as HTMLElement).style.opacity = "1";
					}}
				>
					<Plus size={16} />
					Add Employee
				</button>
			</div>

			{/* ── Search + filter bar ── */}
			<div
				style={{
					display: "flex",
					gap: 10,
					flexWrap: "wrap",
					alignItems: "center",
				}}
			>
				{/* Search */}
				<div style={{ flex: 1, minWidth: 200, position: "relative" }}>
					<Search
						size={15}
						color="#94a3b8"
						style={{
							position: "absolute",
							left: 13,
							top: "50%",
							transform: "translateY(-50%)",
							pointerEvents: "none",
						}}
					/>
					<input
						type="text"
						placeholder="Search employees..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						style={{
							width: "100%",
							height: 40,
							paddingLeft: 38,
							paddingRight: 14,
							borderRadius: 8,
							border: "1.5px solid #e8edf3",
							fontSize: "0.875rem",
							color: "#334155",
							background: "#fff",
							outline: "none",
							boxSizing: "border-box",
							transition: "border-color 0.15s",
							fontFamily: "inherit",
						}}
						onFocus={(e) => {
							(e.target as HTMLInputElement).style.borderColor = "#93c5fd";
						}}
						onBlur={(e) => {
							(e.target as HTMLInputElement).style.borderColor = "#e8edf3";
						}}
					/>
				</div>

				{/* Filter toggle */}
				{/* <button
					type="button"
					onClick={() => setShowFilters(!showFilters)}
					style={{
						display: "flex",
						alignItems: "center",
						gap: 7,
						padding: "0 16px",
						height: 40,
						borderRadius: 8,
						border: showFilters ? "1.5px solid #93c5fd" : "1.5px solid #e8edf3",
						background: showFilters ? "#eff6ff" : "#fff",
						color: showFilters ? "#1a7fd4" : "#64748b",
						fontWeight: 500,
						fontSize: "0.875rem",
						cursor: "pointer",
						transition: "all 0.15s",
						whiteSpace: "nowrap",
						fontFamily: "inherit",
					}}
				>
					<SlidersHorizontal size={15} />
					Filters
				</button> */}

				<select
					aria-label="Employee status"
					value={filters.status ?? ""}
					onChange={(event) =>
						handleStatusFilterChange(
							event.target.value
								? (event.target.value as EmployeeStatus)
								: undefined,
						)
					}
					style={{
						height: 40,
						minWidth: 140,
						padding: "0 34px 0 12px",
						borderRadius: 8,
						border: "1.5px solid #e8edf3",
						background: "#fff",
						color: filters.status ? "#1a7fd4" : "#64748b",
						fontSize: "0.875rem",
						fontWeight: filters.status ? 700 : 500,
						cursor: "pointer",
						fontFamily: "inherit",
						outline: "none",
					}}
					onFocus={(e) => {
						e.currentTarget.style.borderColor = "#93c5fd";
					}}
					onBlur={(e) => {
						e.currentTarget.style.borderColor = "#e8edf3";
					}}
				>
					{STATUS_FILTERS.map((statusFilter) => (
						<option key={statusFilter.label} value={statusFilter.value}>
							{statusFilter.label}
						</option>
					))}
				</select>
			</div>

			{/* Filters panel */}
			{showFilters && (
				<div
					style={{
						background: "#fff",
						borderRadius: 12,
						border: "1px solid #e8edf3",
						padding: "16px 20px",
					}}
				>
					<EmployeeFilters
						filters={filters}
						onFiltersChange={handleFiltersChange}
					/>
				</div>
			)}

			{/* ── Table ── */}
			<EmployeeTable
				data={data?.data ?? []}
				isLoading={isLoading}
				pagination={data?.meta}
				onPageChange={setPage}
				onEdit={handleEdit}
				onDelete={handleDelete}
				onToggleStatus={handleToggleStatus}
			/>

			<EmployeeDialog
				open={dialogOpen}
				onClose={handleDialogClose}
				employee={selectedEmployee}
			/>
		</div>
	);
}
