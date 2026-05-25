import { EmployeeDialog } from "@/components/employees/employee-dialog";
import { EmployeeFilters } from "@/components/employees/employee-filters";
import { EmployeeTable } from "@/components/employees/employee-table";
import { useToast } from "@/hooks/use-toast";
import { employeeService } from "@/services/employee.service";
import type { Employee, EmployeeFilters as Filters } from "@repo/types";
import { EmployeeStatus } from "@repo/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Search } from "lucide-react";
import { useState } from "react";

// ── Constants ─────────────────────────────────────────────────────────────────
const PAGE_SIZE = 20;
const DEFAULT_SORT_BY = "createdAt" as const;
const DEFAULT_SORT_ORDER = "desc" as const;

const STATUS_FILTERS = [
	{ label: "All statuses", value: "" },
	{ label: "Active", value: EmployeeStatus.ACTIVE },
	{ label: "Inactive", value: EmployeeStatus.INACTIVE },
] as const;

// ── EmployeesPage ─────────────────────────────────────────────────────────────
export function EmployeesPage() {
	const [page, setPage] = useState(1);
	const [search, setSearch] = useState("");
	const [filters, setFilters] = useState<Filters>({});
	const [showFilters] = useState(false);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
		null,
	);

	const queryClient = useQueryClient();
	const { toast } = useToast();

	const { data, isLoading } = useQuery({
		queryKey: ["employees", page, search, filters],
		queryFn: () => {
			const cleanFilters: Filters = { ...filters };
			if (search) cleanFilters.search = search;
			return employeeService.getAll(
				{
					page,
					limit: PAGE_SIZE,
					sortBy: DEFAULT_SORT_BY,
					sortOrder: DEFAULT_SORT_ORDER,
				},
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
		setFilters((prev) => {
			const next = { ...prev };
			if (status) {
				next.status = status;
			} else {
				next.status = undefined;
			}
			return next;
		});
		setPage(1);
	};

	const activeStatusLabel =
		filters.status === EmployeeStatus.ACTIVE
			? "Active Employees"
			: filters.status === EmployeeStatus.INACTIVE
				? "Inactive Employees"
				: "All Employees";

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				gap: 24,
				fontFamily: "'Segoe UI', system-ui, sans-serif",
			}}
		>
			<style>{`
				.emp-toolbar { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }
				.emp-search { flex: 1; min-width: 180px; position: relative; }
				@media (max-width: 540px) {
					.emp-section-header { flex-direction: column !important; align-items: flex-start !important; }
					.emp-toolbar { flex-direction: column !important; align-items: stretch !important; }
					.emp-search { min-width: unset !important; width: 100% !important; }
					.emp-status-select { width: 100% !important; }
					.emp-add-btn { width: 100% !important; justify-content: center !important; }
				}
			`}</style>

			{/* Page header */}
			<div>
				<h1
					style={{
						fontSize: "1.4rem",
						fontWeight: 700,
						color: "#0f172a",
						margin: "0 0 2px",
					}}
				>
					Employees
				</h1>
			</div>

			{/* Section header */}
			<div
				className="emp-section-header"
				style={{
					display: "flex",
					alignItems: "flex-start",
					justifyContent: "space-between",
					gap: 14,
					flexWrap: "wrap",
				}}
			>
				<div>
					<h2
						style={{
							fontSize: "1rem",
							fontWeight: 700,
							color: "#0f172a",
							margin: "0 0 3px",
						}}
					>
						{activeStatusLabel}
					</h2>
					<p style={{ fontSize: "0.82rem", color: "#94a3b8", margin: 0 }}>
						Manage your organization's employee records and access.
					</p>
				</div>

				<button
					type="button"
					className="emp-add-btn"
					onClick={() => setDialogOpen(true)}
					style={{
						display: "flex",
						alignItems: "center",
						gap: 7,
						padding: "9px 18px",
						borderRadius: 9,
						background: "linear-gradient(135deg,#3b9eff,#1a7fd4)",
						color: "#fff",
						border: "none",
						fontWeight: 600,
						fontSize: "0.875rem",
						cursor: "pointer",
						boxShadow: "0 3px 10px rgba(26,127,212,0.28)",
						transition: "opacity 0.15s",
						fontFamily: "inherit",
						whiteSpace: "nowrap",
					}}
					onMouseEnter={(e) => {
						(e.currentTarget as HTMLElement).style.opacity = "0.9";
					}}
					onMouseLeave={(e) => {
						(e.currentTarget as HTMLElement).style.opacity = "1";
					}}
				>
					<Plus size={15} aria-hidden="true" />
					Add Employee
				</button>
			</div>

			{/* Toolbar: search + status filter */}
			<div className="emp-toolbar">
				<div className="emp-search">
					<Search
						size={14}
						color="#94a3b8"
						aria-hidden="true"
						style={{
							position: "absolute",
							left: 12,
							top: "50%",
							transform: "translateY(-50%)",
							pointerEvents: "none",
						}}
					/>
					<input
						type="search"
						placeholder="Search employees..."
						value={search}
						onChange={(e) => {
							setSearch(e.target.value);
							setPage(1);
						}}
						aria-label="Search employees"
						style={{
							width: "100%",
							height: 40,
							paddingLeft: 36,
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

				<select
					className="emp-status-select"
					aria-label="Filter by employee status"
					value={filters.status ?? ""}
					onChange={(e) =>
						handleStatusFilterChange(
							e.target.value ? (e.target.value as EmployeeStatus) : undefined,
						)
					}
					style={{
						height: 40,
						minWidth: 140,
						padding: "0 32px 0 12px",
						borderRadius: 8,
						border: "1.5px solid #e8edf3",
						background: "#fff",
						color: filters.status ? "#1a7fd4" : "#64748b",
						fontSize: "0.875rem",
						fontWeight: filters.status ? 600 : 500,
						cursor: "pointer",
						fontFamily: "inherit",
						outline: "none",
						appearance: "auto",
					}}
					onFocus={(e) => {
						e.currentTarget.style.borderColor = "#93c5fd";
					}}
					onBlur={(e) => {
						e.currentTarget.style.borderColor = "#e8edf3";
					}}
				>
					{STATUS_FILTERS.map((f) => (
						<option key={f.value} value={f.value}>
							{f.label}
						</option>
					))}
				</select>
			</div>

			{/* Advanced filters panel */}
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

			{/* Table */}
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
