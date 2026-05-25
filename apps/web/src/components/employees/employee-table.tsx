import type { Employee, EmployeeStatus, PaginatedResponse } from "@repo/types";
import { formatCurrency, formatDate } from "@repo/utils";
import { Edit, Power, RotateCcw, X } from "lucide-react";
import { useState } from "react";

interface EmployeeTableProps {
	data: Employee[];
	isLoading: boolean;
	pagination?: PaginatedResponse<Employee>["meta"];
	onPageChange: (page: number) => void;
	onEdit: (employee: Employee) => void;
	onDelete: (id: string) => void;
	onToggleStatus: (id: string, currentStatus: EmployeeStatus) => void;
}

// ── Avatar ───────────────────────────────────────────────────────────────────
function Avatar({ name }: { name: string }) {
	const initial = name.trim()[0]?.toUpperCase() ?? "?";

	const palettes: Record<string, [string, string]> = {
		A: ["#dbeafe", "#1d4ed8"],
		B: ["#ede9fe", "#7c3aed"],
		C: ["#dcfce7", "#16a34a"],
		D: ["#fef9c3", "#ca8a04"],
		E: ["#ffedd5", "#ea580c"],
		F: ["#fce7f3", "#db2777"],
		G: ["#e0f2fe", "#0284c7"],
		H: ["#f0fdf4", "#15803d"],
		I: ["#fdf2f8", "#9d174d"],
		J: ["#ecfdf5", "#047857"],
		K: ["#fff7ed", "#c2410c"],
		L: ["#f0f9ff", "#0369a1"],
		M: ["#fef3c7", "#b45309"],
		N: ["#f5f3ff", "#6d28d9"],
		O: ["#fdf4ff", "#a21caf"],
		P: ["#f0fdf4", "#15803d"],
		Q: ["#eff6ff", "#1d4ed8"],
		R: ["#fef2f2", "#dc2626"],
		S: ["#f8fafc", "#475569"],
		T: ["#ede9fe", "#7c3aed"],
		U: ["#dbeafe", "#1d4ed8"],
		V: ["#dcfce7", "#16a34a"],
		W: ["#fef9c3", "#ca8a04"],
		X: ["#ffedd5", "#ea580c"],
		Y: ["#fce7f3", "#db2777"],
		Z: ["#e0f2fe", "#0284c7"],
	};

	const [bg, color] = palettes[initial] ?? ["#dbeafe", "#1d4ed8"];

	return (
		<div
			style={{
				width: 34,
				height: 34,
				borderRadius: "50%",
				background: bg,
				color,
				fontWeight: 700,
				fontSize: "0.85rem",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				flexShrink: 0,
			}}
		>
			{initial}
		</div>
	);
}

// ── RoleBadge ────────────────────────────────────────────────────────────────
function RoleBadge({ role }: { role: string }) {
	const map: Record<string, [string, string]> = {
		ADMIN: ["#f3e8ff", "#9333ea"],
		"SUPER ADMIN": ["#ede9fe", "#7c3aed"],
		MANAGER: ["#dbeafe", "#1d4ed8"],
		EMPLOYEE: ["#f0f9ff", "#0284c7"],
		HR: ["#fef3c7", "#b45309"],
		FINANCE: ["#dcfce7", "#16a34a"],
		EDITOR: ["#fdf4ff", "#a21caf"],
		VIEWER: ["#f8fafc", "#475569"],
		REVIEWER: ["#f0fdf4", "#059669"],
		"BRAND MANAGER": ["#fff7ed", "#c2410c"],
	};

	const key = role.toUpperCase();
	const [bg, color] = map[key] ?? ["#f1f5f9", "#475569"];
	const label = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();

	return (
		<span
			style={{
				display: "inline-block",
				padding: "3px 12px",
				borderRadius: 999,
				background: bg,
				color,
				fontSize: "0.78rem",
				fontWeight: 500,
				whiteSpace: "nowrap",
			}}
		>
			{label}
		</span>
	);
}

// ── StatusBadge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
	const active = status === "ACTIVE";
	return (
		<span
			style={{
				display: "inline-block",
				padding: "3px 12px",
				borderRadius: 999,
				background: active ? "#f0fdf4" : "#f8fafc",
				color: active ? "#16a34a" : "#64748b",
				fontSize: "0.78rem",
				fontWeight: 500,
				border: `1px solid ${active ? "#bbf7d0" : "#e2e8f0"}`,
				whiteSpace: "nowrap",
			}}
		>
			{active ? "Active" : "Disabled"}
		</span>
	);
}

// ── ActionIcon ───────────────────────────────────────────────────────────────
function ActionIcon({
	children,
	onClick,
	danger,
	title,
}: {
	children: React.ReactNode;
	onClick: () => void;
	danger?: boolean;
	title?: string;
}) {
	return (
		<button
			type="button"
			title={title}
			onClick={onClick}
			style={{
				background: "none",
				border: "none",
				cursor: "pointer",
				width: 30,
				height: 30,
				borderRadius: 6,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				color: danger ? "#ef4444" : "#94a3b8",
				transition: "color 0.15s, background 0.15s",
				flexShrink: 0,
			}}
			onMouseEnter={(e) => {
				(e.currentTarget as HTMLElement).style.color = danger
					? "#dc2626"
					: "#1a7fd4";
				(e.currentTarget as HTMLElement).style.background = danger
					? "#fef2f2"
					: "#eff6ff";
			}}
			onMouseLeave={(e) => {
				(e.currentTarget as HTMLElement).style.color = danger
					? "#ef4444"
					: "#94a3b8";
				(e.currentTarget as HTMLElement).style.background = "none";
			}}
		>
			{children}
		</button>
	);
}

// ── ConfirmDialog ────────────────────────────────────────────────────────────
function ConfirmDialog({
	open,
	onClose,
	onConfirm,
	title,
	message,
	confirmText = "Confirm",
	isDanger = false,
}: {
	open: boolean;
	onClose: () => void;
	onConfirm: () => void;
	title: string;
	message: string;
	confirmText?: string;
	isDanger?: boolean;
}) {
	if (!open) return null;

	return (
		<button
			type="button"
			onClick={onClose}
			style={{
				position: "fixed",
				inset: 0,
				background: "rgba(15,23,42,0.45)",
				backdropFilter: "blur(4px)",
				zIndex: 200,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				border: "none",
				padding: 0,
				cursor: "default",
			}}
			aria-label="Close dialog"
		>
			<div
				onClick={(e) => e.stopPropagation()}
				onKeyDown={(e) => e.stopPropagation()}
				role="presentation"
				style={{
					background: "#fff",
					borderRadius: 16,
					boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
					width: "min(440px, 90vw)",
					overflow: "hidden",
					fontFamily: "'Segoe UI', system-ui, sans-serif",
				}}
			>
				<div
					style={{
						padding: "20px 24px",
						borderBottom: "1px solid #f1f5f9",
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
					}}
				>
					<h3
						style={{
							margin: 0,
							fontSize: "1rem",
							fontWeight: 700,
							color: "#0f172a",
						}}
					>
						{title}
					</h3>
					<button
						type="button"
						onClick={onClose}
						style={{
							background: "none",
							border: "none",
							cursor: "pointer",
							padding: 6,
							borderRadius: 6,
							display: "flex",
							color: "#94a3b8",
						}}
					>
						<X size={16} />
					</button>
				</div>

				<div
					style={{
						padding: "20px 24px",
						fontSize: "0.9rem",
						color: "#64748b",
						lineHeight: 1.6,
					}}
				>
					{message}
				</div>

				<div
					style={{
						padding: "14px 24px",
						borderTop: "1px solid #f1f5f9",
						display: "flex",
						gap: 10,
						justifyContent: "flex-end",
					}}
				>
					<button
						type="button"
						onClick={onClose}
						style={{
							padding: "8px 18px",
							borderRadius: 8,
							border: "1.5px solid #e2e8f0",
							background: "#fff",
							color: "#475569",
							fontSize: "0.875rem",
							fontWeight: 500,
							cursor: "pointer",
							fontFamily: "inherit",
						}}
					>
						Cancel
					</button>
					<button
						type="button"
						onClick={() => {
							onConfirm();
							onClose();
						}}
						style={{
							padding: "8px 20px",
							borderRadius: 8,
							border: "none",
							background: isDanger
								? "linear-gradient(135deg,#ef4444,#dc2626)"
								: "linear-gradient(135deg,#3b9eff,#1a7fd4)",
							color: "#fff",
							fontSize: "0.875rem",
							fontWeight: 600,
							cursor: "pointer",
							fontFamily: "inherit",
							boxShadow: isDanger
								? "0 3px 8px rgba(239,68,68,0.25)"
								: "0 3px 8px rgba(26,127,212,0.25)",
						}}
					>
						{confirmText}
					</button>
				</div>
			</div>
		</button>
	);
}

// ── EmployeeTable ─────────────────────────────────────────────────────────────
export function EmployeeTable({
	data,
	isLoading,
	pagination,
	onPageChange,
	onEdit,
	onDelete,
	onToggleStatus,
}: EmployeeTableProps) {
	const [deleteConfirm, setDeleteConfirm] = useState<{
		open: boolean;
		employeeId: string;
		employeeName: string;
	}>({ open: false, employeeId: "", employeeName: "" });

	if (isLoading) {
		return (
			<div
				style={{
					background: "#fff",
					borderRadius: 12,
					border: "1px solid #e8edf3",
					padding: "60px 48px",
					textAlign: "center",
				}}
			>
				<div
					style={{
						width: 32,
						height: 32,
						margin: "0 auto 12px",
						border: "3px solid #e2e8f0",
						borderTopColor: "#1a7fd4",
						borderRadius: "50%",
						animation: "spin 0.8s linear infinite",
					}}
				/>
				<p style={{ color: "#94a3b8", fontSize: "0.875rem", margin: 0 }}>
					Loading employees…
				</p>
				<style>{"@keyframes spin { to { transform: rotate(360deg); } }"}</style>
			</div>
		);
	}

	if (data.length === 0) {
		return (
			<div
				style={{
					background: "#fff",
					borderRadius: 12,
					border: "1px solid #e8edf3",
					padding: "60px 48px",
					textAlign: "center",
				}}
			>
				<p style={{ color: "#94a3b8", fontSize: "0.875rem", margin: 0 }}>
					No employees found.
				</p>
			</div>
		);
	}

	const thStyle: React.CSSProperties = {
		padding: "11px 16px",
		textAlign: "left",
		fontSize: "0.72rem",
		fontWeight: 600,
		color: "#94a3b8",
		textTransform: "uppercase",
		letterSpacing: "0.07em",
		whiteSpace: "nowrap",
		background: "transparent",
		borderBottom: "1px solid #f0f4f8",
	};

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
			<div
				style={{
					background: "#fff",
					borderRadius: 12,
					border: "1px solid #e8edf3",
					overflow: "hidden",
				}}
			>
				<div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
					<table
						style={{
							width: "100%",
							borderCollapse: "collapse",
							minWidth: 780,
							fontFamily: "'Segoe UI', system-ui, sans-serif",
						}}
					>
						<thead>
							<tr>
								<th style={thStyle}>User</th>
								<th style={thStyle}>Department</th>
								<th style={thStyle}>Job Title</th>
								<th style={thStyle}>Country</th>
								<th style={{ ...thStyle, textAlign: "right" }}>Salary</th>
								<th style={{ ...thStyle, textAlign: "center" }}>Status</th>
								<th style={{ ...thStyle, textAlign: "left" }}>Joined</th>
								<th style={{ ...thStyle, textAlign: "right" }}>Actions</th>
							</tr>
						</thead>
						<tbody>
							{data.map((employee, i) => (
								<tr
									key={employee.id}
									style={{
										borderBottom:
											i < data.length - 1 ? "1px solid #f8fafc" : "none",
										transition: "background 0.1s",
									}}
									onMouseEnter={(e) => {
										const target = e.currentTarget as HTMLElement;
										target.style.background = "#fafbfd";
									}}
									onMouseLeave={(e) => {
										const target = e.currentTarget as HTMLElement;
										target.style.background = "transparent";
									}}
								>
									{/* User */}
									<td style={{ padding: "13px 16px" }}>
										<div
											style={{ display: "flex", alignItems: "center", gap: 11 }}
										>
											<Avatar name={employee.fullName} />
											<div>
												<p
													style={{
														fontWeight: 600,
														fontSize: "0.875rem",
														color: "#0f172a",
														margin: 0,
														lineHeight: 1.3,
													}}
												>
													{employee.fullName}
												</p>
												<p
													style={{
														fontSize: "0.75rem",
														color: "#94a3b8",
														margin: 0,
														lineHeight: 1.3,
													}}
												>
													{employee.email}
												</p>
											</div>
										</div>
									</td>

									{/* Department */}
									<td style={{ padding: "13px 16px" }}>
										<RoleBadge role={employee.department ?? "Employee"} />
									</td>

									{/* Job Title */}
									<td
										style={{
											padding: "13px 16px",
											fontSize: "0.85rem",
											color: "#475569",
										}}
									>
										{employee.jobTitle}
									</td>

									{/* Country */}
									<td
										style={{
											padding: "13px 16px",
											fontSize: "0.85rem",
											color: "#475569",
										}}
									>
										{employee.country}
									</td>

									{/* Salary */}
									<td
										style={{
											padding: "13px 16px",
											textAlign: "right",
											fontSize: "0.85rem",
											fontWeight: 600,
											color: "#0f172a",
											whiteSpace: "nowrap",
										}}
									>
										{formatCurrency(employee.salary, employee.currency)}
									</td>

									{/* Status */}
									<td style={{ padding: "13px 16px", textAlign: "center" }}>
										<StatusBadge status={employee.status} />
									</td>

									{/* Joined */}
									<td
										style={{
											padding: "13px 16px",
											fontSize: "0.82rem",
											color: "#64748b",
											whiteSpace: "nowrap",
										}}
									>
										{formatDate(employee.joiningDate)}
									</td>

									{/* Actions — edit | reset | power (icon-only, matching screenshot) */}
									<td style={{ padding: "13px 16px" }}>
										<div
											style={{
												display: "flex",
												alignItems: "center",
												justifyContent: "flex-end",
												gap: 0,
											}}
										>
											<ActionIcon onClick={() => onEdit(employee)} title="Edit">
												<Edit size={15} />
											</ActionIcon>
											<ActionIcon
												onClick={() =>
													setDeleteConfirm({
														open: true,
														employeeId: employee.id,
														employeeName: employee.fullName,
													})
												}
												title="Reset / Delete"
											>
												<RotateCcw size={15} />
											</ActionIcon>
											<ActionIcon
												onClick={() =>
													onToggleStatus(employee.id, employee.status)
												}
												title={
													employee.status === "ACTIVE"
														? "Deactivate"
														: "Activate"
												}
												danger={employee.status !== "ACTIVE"}
											>
												<Power size={15} />
											</ActionIcon>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			{/* Delete Confirm */}
			<ConfirmDialog
				open={deleteConfirm.open}
				onClose={() =>
					setDeleteConfirm({ open: false, employeeId: "", employeeName: "" })
				}
				onConfirm={() => onDelete(deleteConfirm.employeeId)}
				title="Delete Employee"
				message={`Are you sure you want to permanently delete ${deleteConfirm.employeeName}? This action cannot be undone.`}
				confirmText="Delete"
				isDanger
			/>

			{/* Pagination */}
			{pagination && pagination.totalPages > 1 && (
				<div
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						flexWrap: "wrap",
						gap: 12,
						padding: "4px 0",
					}}
				>
					<p style={{ fontSize: "0.82rem", color: "#94a3b8", margin: 0 }}>
						Showing{" "}
						<span style={{ color: "#0f172a", fontWeight: 600 }}>
							{(pagination.page - 1) * pagination.limit + 1}–
							{Math.min(pagination.page * pagination.limit, pagination.total)}
						</span>{" "}
						of{" "}
						<span style={{ color: "#0f172a", fontWeight: 600 }}>
							{pagination.total}
						</span>{" "}
						employees
					</p>

					<div style={{ display: "flex", gap: 6 }}>
						{[
							{
								label: "← Previous",
								disabled: !pagination.hasPreviousPage,
								page: pagination.page - 1,
							},
							{
								label: "Next →",
								disabled: !pagination.hasNextPage,
								page: pagination.page + 1,
							},
						].map(({ label, disabled, page }) => (
							<button
								type="button"
								key={label}
								disabled={disabled}
								onClick={() => onPageChange(page)}
								style={{
									padding: "6px 14px",
									borderRadius: 8,
									border: "1px solid #e2e8f0",
									background: disabled ? "#f8fafc" : "#fff",
									color: disabled ? "#cbd5e1" : "#475569",
									fontSize: "0.82rem",
									fontWeight: 500,
									cursor: disabled ? "not-allowed" : "pointer",
									transition: "all 0.15s",
									fontFamily: "inherit",
								}}
								onMouseEnter={(e) => {
									if (!disabled) {
										const target = e.currentTarget as HTMLElement;
										target.style.background = "#eff6ff";
										target.style.color = "#1a7fd4";
										target.style.borderColor = "#bfdbfe";
									}
								}}
								onMouseLeave={(e) => {
									if (!disabled) {
										const target = e.currentTarget as HTMLElement;
										target.style.background = "#fff";
										target.style.color = "#475569";
										target.style.borderColor = "#e2e8f0";
									}
								}}
							>
								{label}
							</button>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
