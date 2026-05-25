import type { Employee, PaginatedResponse } from "@repo/types";
import { formatCurrency, formatDate } from "@repo/utils";
import { Edit, Power, Trash2, X } from "lucide-react";
import { useState } from "react";

interface EmployeeTableProps {
	data: Employee[];
	isLoading: boolean;
	pagination?: PaginatedResponse<Employee>["meta"];
	onPageChange: (page: number) => void;
	onEdit: (employee: Employee) => void;
	onDelete: (id: string) => void;
	onToggleStatus: (id: string, currentStatus: string) => void;
}

function Avatar({ name }: { name: string }) {
	const initials = name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase()
		.slice(0, 1);

	const colors: Record<string, string> = {
		A: "#dbeafe",
		B: "#ede9fe",
		C: "#dcfce7",
		D: "#fef9c3",
		E: "#ffedd5",
		F: "#fce7f3",
		G: "#e0f2fe",
		H: "#f0fdf4",
		I: "#fdf2f8",
		J: "#ecfdf5",
		K: "#fff7ed",
		L: "#f0f9ff",
		M: "#fef3c7",
		N: "#f5f3ff",
		O: "#fdf4ff",
		P: "#f0fdf4",
		Q: "#eff6ff",
		R: "#fef2f2",
		S: "#f8fafc",
		T: "#ede9fe",
		U: "#dbeafe",
		V: "#dcfce7",
		W: "#fef9c3",
		X: "#ffedd5",
		Y: "#fce7f3",
		Z: "#e0f2fe",
	};
	const textColors: Record<string, string> = {
		A: "#1d4ed8",
		B: "#7c3aed",
		C: "#16a34a",
		D: "#ca8a04",
		E: "#ea580c",
		F: "#db2777",
		G: "#0284c7",
		H: "#15803d",
		I: "#9d174d",
		J: "#047857",
		K: "#c2410c",
		L: "#0369a1",
		M: "#b45309",
		N: "#6d28d9",
		O: "#a21caf",
		P: "#15803d",
		Q: "#1d4ed8",
		R: "#dc2626",
		S: "#475569",
		T: "#7c3aed",
		U: "#1d4ed8",
		V: "#16a34a",
		W: "#ca8a04",
		X: "#ea580c",
		Y: "#db2777",
		Z: "#0284c7",
	};

	const bg = colors[initials] ?? "#dbeafe";
	const color = textColors[initials] ?? "#1d4ed8";

	return (
		<div
			style={{
				width: 36,
				height: 36,
				borderRadius: "50%",
				background: bg,
				color,
				fontWeight: 700,
				fontSize: "0.88rem",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				flexShrink: 0,
			}}
		>
			{initials}
		</div>
	);
}

function RoleBadge({ role }: { role: string }) {
	const map: Record<string, { bg: string; color: string }> = {
		ADMIN: { bg: "#f3e8ff", color: "#9333ea" },
		MANAGER: { bg: "#dbeafe", color: "#1d4ed8" },
		EMPLOYEE: { bg: "#f0f9ff", color: "#0284c7" },
		HR: { bg: "#fef3c7", color: "#b45309" },
		FINANCE: { bg: "#dcfce7", color: "#16a34a" },
	};
	const style = map[role] ?? { bg: "#f1f5f9", color: "#475569" };
	const label = role.charAt(0) + role.slice(1).toLowerCase();
	return (
		<span
			style={{
				padding: "3px 12px",
				borderRadius: 999,
				background: style.bg,
				color: style.color,
				fontSize: "0.78rem",
				fontWeight: 500,
				border: `1px solid ${style.color}22`,
				whiteSpace: "nowrap",
			}}
		>
			{label}
		</span>
	);
}

function StatusBadge({ status }: { status: string }) {
	const active = status === "ACTIVE";
	return (
		<span
			style={{
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

function IconBtn({
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
				padding: 6,
				borderRadius: 8,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				color: danger ? "#ef4444" : "#94a3b8",
				transition: "color 0.15s, background 0.15s",
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

// Confirmation Dialog Component
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
		<>
			{/* Backdrop */}
			<div
				onClick={onClose}
				onKeyDown={(e) => {
					if (e.key === "Escape") onClose();
				}}
				role="button"
				tabIndex={0}
				style={{
					position: "fixed",
					inset: 0,
					background: "rgba(15,23,42,0.5)",
					backdropFilter: "blur(4px)",
					zIndex: 200,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				{/* Dialog */}
				<div
					onClick={(e) => e.stopPropagation()}
					onKeyDown={(e) => e.stopPropagation()}
					role="dialog"
					tabIndex={-1}
					style={{
						background: "#fff",
						borderRadius: 16,
						boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
						width: "min(440px, 90vw)",
						overflow: "hidden",
						fontFamily: "'Segoe UI', system-ui, sans-serif",
					}}
				>
					{/* Header */}
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
								fontSize: "1.1rem",
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
								color: "#64748b",
							}}
						>
							<X size={18} />
						</button>
					</div>

					{/* Body */}
					<div
						style={{
							padding: "24px",
							fontSize: "0.95rem",
							color: "#475569",
							lineHeight: 1.6,
						}}
					>
						{message}
					</div>

					{/* Footer */}
					<div
						style={{
							padding: "16px 24px",
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
								padding: "9px 20px",
								borderRadius: 10,
								border: "1.5px solid #e2e8f0",
								background: "#fff",
								color: "#475569",
								fontSize: "0.9rem",
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
								padding: "9px 24px",
								borderRadius: 10,
								border: "none",
								background: isDanger
									? "linear-gradient(135deg,#ef4444,#dc2626)"
									: "linear-gradient(135deg,#1a7fd4,#0f5fa8)",
								color: "#fff",
								fontSize: "0.9rem",
								fontWeight: 600,
								cursor: "pointer",
								boxShadow: isDanger
									? "0 3px 10px rgba(239,68,68,0.3)"
									: "0 3px 10px rgba(26,127,212,0.3)",
								fontFamily: "inherit",
							}}
						>
							{confirmText}
						</button>
					</div>
				</div>
			</div>
		</>
	);
}

// Mobile card view
function EmployeeCard({
	employee,
	onEdit,
	onDelete,
	onToggleStatus,
}: {
	employee: Employee;
	onEdit: (e: Employee) => void;
	onDelete: (id: string) => void;
	onToggleStatus: (id: string, status: string) => void;
}) {
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
	return (
		<div
			style={{
				background: "#fff",
				borderRadius: 14,
				border: "1px solid #e8edf3",
				padding: "16px",
				display: "flex",
				flexDirection: "column",
				gap: 12,
			}}
		>
			<div
				style={{
					display: "flex",
					alignItems: "center",
					gap: 12,
					justifyContent: "space-between",
				}}
			>
				<div style={{ display: "flex", alignItems: "center", gap: 12 }}>
					<Avatar name={employee.fullName} />
					<div>
						<p
							style={{
								fontWeight: 600,
								fontSize: "0.93rem",
								color: "#1e293b",
								margin: 0,
							}}
						>
							{employee.fullName}
						</p>
						<p style={{ fontSize: "0.78rem", color: "#94a3b8", margin: 0 }}>
							{employee.email}
						</p>
					</div>
				</div>
				<StatusBadge status={employee.status} />
			</div>

			<div
				style={{
					display: "grid",
					gridTemplateColumns: "1fr 1fr",
					gap: "8px 16px",
				}}
			>
				{[
					["Department", employee.department],
					["Job Title", employee.jobTitle],
					["Country", employee.country],
					["Salary", formatCurrency(employee.salary, employee.currency)],
					["Joined", formatDate(employee.joiningDate)],
				].map(([label, value]) => (
					<div key={label}>
						<p
							style={{
								fontSize: "0.7rem",
								color: "#94a3b8",
								margin: "0 0 2px",
								textTransform: "uppercase",
								letterSpacing: "0.05em",
							}}
						>
							{label}
						</p>
						<p
							style={{
								fontSize: "0.85rem",
								color: "#334155",
								margin: 0,
								fontWeight: 500,
							}}
						>
							{value}
						</p>
					</div>
				))}
			</div>

			<div
				style={{
					display: "flex",
					gap: 8,
					borderTop: "1px solid #f1f5f9",
					paddingTop: 10,
				}}
			>
				<RoleBadge role={employee.department ?? "EMPLOYEE"} />
				<div style={{ flex: 1 }} />
				<IconBtn onClick={() => onEdit(employee)} title="Edit">
					<Edit size={16} />
				</IconBtn>
				<IconBtn
					onClick={() => onToggleStatus(employee.id, employee.status)}
					title={employee.status === "ACTIVE" ? "Deactivate" : "Activate"}
				>
					<Power size={16} />
				</IconBtn>
				<IconBtn
					onClick={() => setShowDeleteConfirm(true)}
					danger
					title="Delete Permanently"
				>
					<Trash2 size={16} />
				</IconBtn>
			</div>

			<ConfirmDialog
				open={showDeleteConfirm}
				onClose={() => setShowDeleteConfirm(false)}
				onConfirm={() => onDelete(employee.id)}
				title="Delete Employee"
				message={`Are you sure you want to permanently delete ${employee.fullName}? This action cannot be undone.`}
				confirmText="Delete"
				isDanger
			/>
		</div>
	);
}

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
					borderRadius: 16,
					border: "1px solid #e8edf3",
					padding: "48px",
					textAlign: "center",
				}}
			>
				<div
					style={{
						width: 36,
						height: 36,
						margin: "0 auto 12px",
						border: "3px solid #e2e8f0",
						borderTopColor: "#1a7fd4",
						borderRadius: "50%",
						animation: "spin 0.8s linear infinite",
					}}
				/>
				<p style={{ color: "#94a3b8", fontSize: "0.9rem", margin: 0 }}>
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
					borderRadius: 16,
					border: "1px solid #e8edf3",
					padding: "48px",
					textAlign: "center",
				}}
			>
				<p style={{ color: "#94a3b8", margin: 0 }}>No employees found</p>
			</div>
		);
	}

	const thStyle: React.CSSProperties = {
		padding: "12px 16px",
		textAlign: "left",
		fontSize: "0.75rem",
		fontWeight: 600,
		color: "#94a3b8",
		textTransform: "uppercase",
		letterSpacing: "0.06em",
		whiteSpace: "nowrap",
	};

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
			{/* ── Desktop table ── */}
			<div
				className="hidden-mobile"
				style={{
					background: "#fff",
					borderRadius: 16,
					border: "1px solid #e8edf3",
					overflow: "hidden",
				}}
			>
				<div style={{ overflowX: "auto" }}>
					<table style={{ width: "100%", borderCollapse: "collapse" }}>
						<thead>
							<tr style={{ borderBottom: "1px solid #f1f5f9" }}>
								<th style={thStyle}>User</th>
								<th style={thStyle}>Department</th>
								<th style={thStyle}>Job Title</th>
								<th style={thStyle}>Country</th>
								<th style={{ ...thStyle, textAlign: "right" }}>Salary</th>
								<th style={{ ...thStyle, textAlign: "center" }}>Status</th>
								<th style={{ ...thStyle, textAlign: "center" }}>Joined</th>
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
										transition: "background 0.12s",
									}}
									onMouseEnter={(e) =>
										((e.currentTarget as HTMLElement).style.background =
											"#fafbfc")
									}
									onMouseLeave={(e) =>
										((e.currentTarget as HTMLElement).style.background =
											"transparent")
									}
								>
									{/* User */}
									<td style={{ padding: "14px 16px" }}>
										<div
											style={{ display: "flex", alignItems: "center", gap: 12 }}
										>
											<Avatar name={employee.fullName} />
											<div>
												<p
													style={{
														fontWeight: 600,
														fontSize: "0.9rem",
														color: "#1e293b",
														margin: 0,
													}}
												>
													{employee.fullName}
												</p>
												<p
													style={{
														fontSize: "0.75rem",
														color: "#94a3b8",
														margin: 0,
													}}
												>
													{employee.email}
												</p>
											</div>
										</div>
									</td>

									{/* Department as role badge */}
									<td style={{ padding: "14px 16px" }}>
										<RoleBadge
											role={employee.department?.toUpperCase() ?? "EMPLOYEE"}
										/>
									</td>

									<td
										style={{
											padding: "14px 16px",
											fontSize: "0.87rem",
											color: "#475569",
										}}
									>
										{employee.jobTitle}
									</td>

									<td
										style={{
											padding: "14px 16px",
											fontSize: "0.87rem",
											color: "#475569",
										}}
									>
										{employee.country}
									</td>

									<td
										style={{
											padding: "14px 16px",
											textAlign: "right",
											fontSize: "0.87rem",
											fontWeight: 600,
											color: "#1e293b",
											whiteSpace: "nowrap",
										}}
									>
										{formatCurrency(employee.salary, employee.currency)}
									</td>

									<td style={{ padding: "14px 16px", textAlign: "center" }}>
										<StatusBadge status={employee.status} />
									</td>

									<td
										style={{
											padding: "14px 16px",
											textAlign: "center",
											fontSize: "0.8rem",
											color: "#64748b",
											whiteSpace: "nowrap",
										}}
									>
										{formatDate(employee.joiningDate)}
									</td>

									{/* Actions */}
									<td style={{ padding: "14px 16px" }}>
										<div
											style={{
												display: "flex",
												alignItems: "center",
												justifyContent: "flex-end",
												gap: 2,
											}}
										>
											<IconBtn onClick={() => onEdit(employee)} title="Edit">
												<Edit size={15} />
											</IconBtn>
											<IconBtn
												onClick={() =>
													onToggleStatus(employee.id, employee.status)
												}
												title={
													employee.status === "ACTIVE"
														? "Deactivate"
														: "Activate"
												}
											>
												<Power size={15} />
											</IconBtn>
											<IconBtn
												onClick={() =>
													setDeleteConfirm({
														open: true,
														employeeId: employee.id,
														employeeName: employee.fullName,
													})
												}
												danger
												title="Delete Permanently"
											>
												<Trash2 size={15} />
											</IconBtn>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			{/* Delete Confirmation Dialog */}
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

			{/* ── Mobile cards ── */}
			<div
				className="show-mobile"
				style={{ display: "flex", flexDirection: "column", gap: 10 }}
			>
				{data.map((employee) => (
					<EmployeeCard
						key={employee.id}
						employee={employee}
						onEdit={onEdit}
						onDelete={onDelete}
						onToggleStatus={onToggleStatus}
					/>
				))}
			</div>

			{/* ── Pagination ── */}
			{pagination && pagination.totalPages > 1 && (
				<div
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						flexWrap: "wrap",
						gap: 12,
					}}
				>
					<p style={{ fontSize: "0.85rem", color: "#94a3b8", margin: 0 }}>
						Showing{" "}
						<span style={{ color: "#1e293b", fontWeight: 600 }}>
							{(pagination.page - 1) * pagination.limit + 1}–
							{Math.min(pagination.page * pagination.limit, pagination.total)}
						</span>{" "}
						of{" "}
						<span style={{ color: "#1e293b", fontWeight: 600 }}>
							{pagination.total}
						</span>{" "}
						employees
					</p>

					<div style={{ display: "flex", gap: 8 }}>
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
									padding: "7px 16px",
									borderRadius: 10,
									border: "1px solid #e2e8f0",
									background: disabled ? "#f8fafc" : "#fff",
									color: disabled ? "#cbd5e1" : "#475569",
									fontSize: "0.85rem",
									fontWeight: 500,
									cursor: disabled ? "not-allowed" : "pointer",
									transition: "all 0.15s",
								}}
								onMouseEnter={(e) => {
									if (!disabled) {
										(e.currentTarget as HTMLElement).style.background =
											"#eff6ff";
										(e.currentTarget as HTMLElement).style.color = "#1a7fd4";
										(e.currentTarget as HTMLElement).style.borderColor =
											"#bfdbfe";
									}
								}}
								onMouseLeave={(e) => {
									if (!disabled) {
										(e.currentTarget as HTMLElement).style.background = "#fff";
										(e.currentTarget as HTMLElement).style.color = "#475569";
										(e.currentTarget as HTMLElement).style.borderColor =
											"#e2e8f0";
									}
								}}
							>
								{label}
							</button>
						))}
					</div>
				</div>
			)}

			<style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        @media (min-width: 769px) {
          .hidden-mobile { display: block !important; }
          .show-mobile { display: none !important; }
        }
      `}</style>
		</div>
	);
}
