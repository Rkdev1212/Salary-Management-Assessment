import { EmployeeDialog } from "@/components/employees/employee-dialog";
import { EmployeeFilters } from "@/components/employees/employee-filters";
import { EmployeeTable } from "@/components/employees/employee-table";
import { useToast } from "@/hooks/use-toast";
import { employeeService } from "@/services/employee.service";
import type { Employee, EmployeeFilters as Filters } from "@repo/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

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
		mutationFn: ({ id, status }: { id: string; status: string }) =>
			employeeService.update(id, {
				status: status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
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

	const handleDelete = (id: string) => {
		deleteMutation.mutate(id);
	};

	const handleToggleStatus = (id: string, currentStatus: string) => {
		toggleStatusMutation.mutate({ id, status: currentStatus });
	};

	const handleDialogClose = () => {
		setDialogOpen(false);
		setSelectedEmployee(null);
	};

	const handleFiltersChange = (newFilters: Filters) => {
		setFilters(newFilters);
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
					<h1
						style={{
							fontSize: "1.6rem",
							fontWeight: 700,
							color: "#1e293b",
							margin: "0 0 4px",
						}}
					>
						Employees
					</h1>
					<p style={{ fontSize: "0.88rem", color: "#94a3b8", margin: 0 }}>
						Manage your organization's employee records
					</p>
				</div>

				<button
					type="button"
					onClick={() => setDialogOpen(true)}
					style={{
						display: "flex",
						alignItems: "center",
						gap: 8,
						padding: "10px 20px",
						borderRadius: 12,
						background: "linear-gradient(135deg,#1a7fd4,#0f5fa8)",
						color: "#fff",
						border: "none",
						fontWeight: 600,
						fontSize: "0.9rem",
						cursor: "pointer",
						boxShadow: "0 4px 12px rgba(26,127,212,0.3)",
						transition: "opacity 0.15s",
					}}
					onMouseEnter={(e) => {
						(e.currentTarget as HTMLElement).style.opacity = "0.9";
					}}
					onMouseLeave={(e) => {
						(e.currentTarget as HTMLElement).style.opacity = "1";
					}}
				>
					<Plus size={18} />
					Add Employee
				</button>
			</div>

			{/* ── Search + filter bar ── */}
			<div
				style={{
					background: "#fff",
					borderRadius: 16,
					border: "1px solid #e8edf3",
					padding: "16px 20px",
					display: "flex",
					flexDirection: "column",
					gap: 14,
				}}
			>
				<div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
					{/* Search */}
					<div style={{ flex: 1, minWidth: 200, position: "relative" }}>
						<Search
							size={16}
							color="#94a3b8"
							style={{
								position: "absolute",
								left: 14,
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
								height: 42,
								paddingLeft: 40,
								paddingRight: 14,
								borderRadius: 10,
								border: "1.5px solid #e2e8f0",
								fontSize: "0.9rem",
								color: "#334155",
								background: "#fafafa",
								outline: "none",
								boxSizing: "border-box",
								transition: "border-color 0.15s",
							}}
							onFocus={(e) =>
								((e.target as HTMLInputElement).style.borderColor = "#93c5fd")
							}
							onBlur={(e) =>
								((e.target as HTMLInputElement).style.borderColor = "#e2e8f0")
							}
						/>
					</div>

					{/* Filter toggle */}
					<button
						type="button"
						onClick={() => setShowFilters(!showFilters)}
						style={{
							display: "flex",
							alignItems: "center",
							gap: 8,
							padding: "0 18px",
							height: 42,
							borderRadius: 10,
							border: showFilters
								? "1.5px solid #93c5fd"
								: "1.5px solid #e2e8f0",
							background: showFilters ? "#eff6ff" : "#fff",
							color: showFilters ? "#1a7fd4" : "#64748b",
							fontWeight: 500,
							fontSize: "0.88rem",
							cursor: "pointer",
							transition: "all 0.15s",
							whiteSpace: "nowrap",
						}}
					>
						<SlidersHorizontal size={16} />
						Filters
					</button>
				</div>

				{showFilters && (
					<div style={{ borderTop: "1px solid #f1f5f9", paddingTop: 14 }}>
						<EmployeeFilters
							filters={filters}
							onFiltersChange={handleFiltersChange}
						/>
					</div>
				)}
			</div>

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
