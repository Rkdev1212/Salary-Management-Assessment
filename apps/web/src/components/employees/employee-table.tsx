import type { Employee, PaginatedResponse } from "@repo/types";
import { EmployeeStatus } from "@repo/types";
import { formatCurrency, formatDate } from "@repo/utils";
import { Edit, Power, Trash2, X } from "lucide-react";
import { useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────
interface EmployeeTableProps {
	data: Employee[];
	isLoading: boolean;
	pagination?: PaginatedResponse<Employee>["meta"];
	onPageChange: (page: number) => void;
	onEdit: (employee: Employee) => void;
	onDelete: (id: string) => void;
	onToggleStatus: (id: string, currentStatus: EmployeeStatus) => void;
}

interface ConfirmDialogProps {
	open: boolean;
	onClose: () => void;
	onConfirm: () => void;
	title: string;
	message: string;
	confirmText?: string;
	isDanger?: boolean;
}

interface DeleteConfirmState {
	open: boolean;
	employeeId: string;
	employeeName: string;
}

// ── Design constants ──────────────────────────────────────────────────────────
const INITIAL_DELETE_STATE: DeleteConfirmState = {
	open: false,
	employeeId: "",
	employeeName: "",
};

// ── Palettes for avatar initials ──────────────────────────────────────────────
const AVATAR_PALETTES: Record<string, [string, string]> = {
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

const ROLE_BADGE_MAP: Record<string, [string, string]> = {
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

const TH_STYLE: React.CSSProperties = {
	padding: "10px 14px",
	textAlign: "left",
	fontSize: "0.7rem",
	fontWeight: 600,
	color: "#94a3b8",
	textTransform: "uppercase",
	letterSpacing: "0.07em",
	whiteSpace: "nowrap",
	background: "transparent",
	borderBottom: "1px solid #f0f4f8",
};

// ── Avatar ───────────────────────────────────────────────────────────────────
function Avatar({ name }: { name: string }) {
	const initial = name.trim()[0]?.toUpperCase() ?? "?";
	const [bg, color] = AVATAR_PALETTES[initial] ?? ["#dbeafe", "#1d4ed8"];

	return (
		<div
			aria-hidden="true"
			style={{
				width: 32,
				height: 32,
				borderRadius: "50%",
				background: bg,
				color,
				fontWeight: 700,
				fontSize: "0.8rem",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				flexShrink: 0,
				userSelect: "none",
			}}
		>
			{initial}
		</div>
	);
}

// ── RoleBadge ────────────────────────────────────────────────────────────────
function RoleBadge({ role }: { role: string }) {
	const key = role.toUpperCase();
	const [bg, color] = ROLE_BADGE_MAP[key] ?? ["#f1f5f9", "#475569"];
	const label = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();

	return (
		<span
			style={{
				display: "inline-block",
				padding: "2px 10px",
				borderRadius: 999,
				background: bg,
				color,
				fontSize: "0.75rem",
				fontWeight: 500,
				whiteSpace: "nowrap",
			}}
		>
			{label}
		</span>
	);
}

// ── StatusBadge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: EmployeeStatus }) {
	const active = status === EmployeeStatus.ACTIVE;
	return (
		<span
			style={{
				display: "inline-block",
				padding: "2px 10px",
				borderRadius: 999,
				background: active ? "#f0fdf4" : "#f8fafc",
				color: active ? "#16a34a" : "#64748b",
				fontSize: "0.75rem",
				fontWeight: 500,
				border: `1px solid ${active ? "#bbf7d0" : "#e2e8f0"}`,
				whiteSpace: "nowrap",
			}}
		>
			{active ? "Active" : "Inactive"}
		</span>
	);
}

// ── ActionIcon ───────────────────────────────────────────────────────────────
type ActionVariant = "edit" | "delete" | "activate" | "deactivate";

const ACTION_VARIANT_STYLES: Record<
	ActionVariant,
	{ color: string; hoverColor: string; hoverBg: string }
> = {
	edit: { color: "#64748b", hoverColor: "#475569", hoverBg: "#f8fafc" },
	deactivate: { color: "#64748b", hoverColor: "#475569", hoverBg: "#f8fafc" },
	delete: { color: "#ef4444", hoverColor: "#dc2626", hoverBg: "#fef2f2" },
	activate: { color: "#ef4444", hoverColor: "#dc2626", hoverBg: "#fef2f2" },
};

interface ActionIconProps {
	children: React.ReactNode;
	onClick: () => void;
	variant: ActionVariant;
	title: string;
}

function ActionIcon({ children, onClick, variant, title }: ActionIconProps) {
	const styles = ACTION_VARIANT_STYLES[variant];

	return (
		<button
			type="button"
			title={title}
			aria-label={title}
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
				color: styles.color,
				transition: "color 0.15s, background 0.15s",
				flexShrink: 0,
			}}
			onMouseEnter={(e) => {
				(e.currentTarget as HTMLElement).style.color = styles.hoverColor;
				(e.currentTarget as HTMLElement).style.background = styles.hoverBg;
			}}
			onMouseLeave={(e) => {
				(e.currentTarget as HTMLElement).style.color = styles.color;
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
}: ConfirmDialogProps) {
	if (!open) return null;

	return (
		<dialog
			open
			aria-labelledby="confirm-dialog-title"
			style={{
				position: "fixed",
				inset: 0,
				background: "rgba(15,23,42,0.45)",
				backdropFilter: "blur(4px)",
				zIndex: 200,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				padding: "0 16px",
			}}
		>
			{/* Backdrop close */}
			<button
				type="button"
				aria-label="Close dialog"
				onClick={onClose}
				style={{
					position: "absolute",
					inset: 0,
					background: "transparent",
					border: "none",
					cursor: "default",
				}}
			/>

			<div
				style={{
					position: "relative",
					background: "#fff",
					borderRadius: 16,
					boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
					width: "min(440px, 100%)",
					overflow: "hidden",
					fontFamily: "'Segoe UI', system-ui, sans-serif",
				}}
			>
				<div
					style={{
						padding: "18px 22px",
						borderBottom: "1px solid #f1f5f9",
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
					}}
				>
					<h3
						id="confirm-dialog-title"
						style={{
							margin: 0,
							fontSize: "0.95rem",
							fontWeight: 700,
							color: "#0f172a",
						}}
					>
						{title}
					</h3>
					<button
						type="button"
						onClick={onClose}
						aria-label="Close"
						style={{
							background: "none",
							border: "none",
							cursor: "pointer",
							padding: 5,
							borderRadius: 6,
							display: "flex",
							color: "#94a3b8",
						}}
					>
						<X size={15} aria-hidden="true" />
					</button>
				</div>

				<div
					style={{
						padding: "18px 22px",
						fontSize: "0.875rem",
						color: "#64748b",
						lineHeight: 1.6,
					}}
				>
					{message}
				</div>

				<div
					style={{
						padding: "13px 22px",
						borderTop: "1px solid #f1f5f9",
						display: "flex",
						gap: 9,
						justifyContent: "flex-end",
					}}
				>
					<button
						type="button"
						onClick={onClose}
						style={{
							padding: "8px 16px",
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
							padding: "8px 18px",
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
		</dialog>
	);
}

// ── PaginationButton ──────────────────────────────────────────────────────────
interface PaginationButtonProps {
	label: string;
	ariaLabel: string;
	disabled: boolean;
	onClick: () => void;
}

function PaginationButton({
	label,
	ariaLabel,
	disabled,
	onClick,
}: PaginationButtonProps) {
	return (
		<button
			type="button"
			disabled={disabled}
			onClick={onClick}
			aria-label={ariaLabel}
			style={{
				display: "inline-flex",
				alignItems: "center",
				justifyContent: "center",
				height: 32,
				padding: "0 12px",
				borderRadius: 8,
				border: "1px solid #e2e8f0",
				background: disabled ? "#f8fafc" : "#fff",
				color: disabled ? "#cbd5e1" : "#475569",
				fontSize: "0.8rem",
				fontWeight: 500,
				cursor: disabled ? "not-allowed" : "pointer",
				transition: "all 0.15s",
				fontFamily: "inherit",
				whiteSpace: "nowrap",
			}}
			onMouseEnter={(e) => {
				if (!disabled) {
					const t = e.currentTarget as HTMLElement;
					t.style.background = "#eff6ff";
					t.style.color = "#1a7fd4";
					t.style.borderColor = "#bfdbfe";
				}
			}}
			onMouseLeave={(e) => {
				if (!disabled) {
					const t = e.currentTarget as HTMLElement;
					t.style.background = "#fff";
					t.style.color = "#475569";
					t.style.borderColor = "#e2e8f0";
				}
			}}
		>
			{label}
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
	const [deleteConfirm, setDeleteConfirm] =
		useState<DeleteConfirmState>(INITIAL_DELETE_STATE);

	if (isLoading) {
		return (
			<div
				aria-busy="true"
				aria-label="Loading employees"
				style={{
					background: "#fff",
					borderRadius: 12,
					border: "1px solid #e8edf3",
					padding: "56px 40px",
					textAlign: "center",
				}}
			>
				<div
					aria-hidden="true"
					style={{
						width: 30,
						height: 30,
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
					padding: "56px 40px",
					textAlign: "center",
				}}
			>
				<p style={{ color: "#94a3b8", fontSize: "0.875rem", margin: 0 }}>
					No employees found.
				</p>
			</div>
		);
	}

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
			{/* Table */}
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
							minWidth: 760,
							fontFamily: "'Segoe UI', system-ui, sans-serif",
						}}
					>
						<thead>
							<tr>
								<th scope="col" style={TH_STYLE}>
									Employee
								</th>
								<th scope="col" style={TH_STYLE}>
									Department
								</th>
								<th scope="col" style={TH_STYLE}>
									Job Title
								</th>
								<th scope="col" style={TH_STYLE}>
									Country
								</th>
								<th scope="col" style={{ ...TH_STYLE, textAlign: "right" }}>
									Salary
								</th>
								<th scope="col" style={{ ...TH_STYLE, textAlign: "center" }}>
									Status
								</th>
								<th scope="col" style={TH_STYLE}>
									Joined
								</th>
								<th scope="col" style={{ ...TH_STYLE, textAlign: "right" }}>
									Actions
								</th>
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
										(e.currentTarget as HTMLElement).style.background =
											"#fafbfd";
									}}
									onMouseLeave={(e) => {
										(e.currentTarget as HTMLElement).style.background =
											"transparent";
									}}
								>
									{/* Employee */}
									<td style={{ padding: "12px 14px" }}>
										<div
											style={{ display: "flex", alignItems: "center", gap: 10 }}
										>
											<Avatar name={employee.fullName} />
											<div>
												<p
													style={{
														fontWeight: 600,
														fontSize: "0.85rem",
														color: "#0f172a",
														margin: 0,
														lineHeight: 1.3,
													}}
												>
													{employee.fullName}
												</p>
												<p
													style={{
														fontSize: "0.72rem",
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
									<td style={{ padding: "12px 14px" }}>
										<RoleBadge role={employee.department ?? "Employee"} />
									</td>

									{/* Job Title */}
									<td
										style={{
											padding: "12px 14px",
											fontSize: "0.82rem",
											color: "#475569",
										}}
									>
										{employee.jobTitle}
									</td>

									{/* Country */}
									<td
										style={{
											padding: "12px 14px",
											fontSize: "0.82rem",
											color: "#475569",
										}}
									>
										{employee.country}
									</td>

									{/* Salary */}
									<td
										style={{
											padding: "12px 14px",
											textAlign: "right",
											fontSize: "0.82rem",
											fontWeight: 600,
											color: "#0f172a",
											whiteSpace: "nowrap",
										}}
									>
										{formatCurrency(employee.salary, employee.currency)}
									</td>

									{/* Status */}
									<td style={{ padding: "12px 14px", textAlign: "center" }}>
										<StatusBadge status={employee.status} />
									</td>

									{/* Joined */}
									<td
										style={{
											padding: "12px 14px",
											fontSize: "0.8rem",
											color: "#64748b",
											whiteSpace: "nowrap",
										}}
									>
										{formatDate(employee.joiningDate)}
									</td>

									{/* Actions */}
									<td style={{ padding: "12px 14px" }}>
										<div
											style={{
												display: "flex",
												alignItems: "center",
												justifyContent: "flex-end",
												gap: 0,
											}}
										>
											<ActionIcon
												onClick={() => onEdit(employee)}
												variant="edit"
												title="Edit employee"
											>
												<Edit size={14} aria-hidden="true" />
											</ActionIcon>

											<ActionIcon
												onClick={() =>
													onToggleStatus(employee.id, employee.status)
												}
												variant={
													employee.status === EmployeeStatus.ACTIVE
														? "deactivate"
														: "activate"
												}
												title={
													employee.status === EmployeeStatus.ACTIVE
														? "Deactivate employee"
														: "Activate employee"
												}
											>
												<Power size={14} aria-hidden="true" />
											</ActionIcon>

											<ActionIcon
												onClick={() =>
													setDeleteConfirm({
														open: true,
														employeeId: employee.id,
														employeeName: employee.fullName,
													})
												}
												variant="delete"
												title="Delete employee"
											>
												<Trash2 size={14} aria-hidden="true" />
											</ActionIcon>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			{/* Delete confirm */}
			<ConfirmDialog
				open={deleteConfirm.open}
				onClose={() => setDeleteConfirm(INITIAL_DELETE_STATE)}
				onConfirm={() => onDelete(deleteConfirm.employeeId)}
				title="Delete Employee"
				message={`Are you sure you want to permanently delete ${deleteConfirm.employeeName}? This action cannot be undone.`}
				confirmText="Delete"
				isDanger
			/>

			{/* Pagination */}
			{pagination && pagination.totalPages > 1 && (
				<>
					<style>{`
						.emp-pagination {
							display: flex;
							align-items: center;
							justify-content: space-between;
							gap: 10px;
							padding: 2px 0;
						}
						.emp-pagination-count {
							font-size: 0.8rem;
							color: #94a3b8;
							margin: 0;
							white-space: nowrap;
						}
						.emp-pagination-btns {
							display: flex;
							align-items: center;
							gap: 4px;
						}
						@media (max-width: 540px) {
							.emp-pagination {
								flex-direction: column;
								align-items: center !important;
								justify-content: center !important;
							}
							.emp-pagination-count {
								text-align: center;
							}
							.emp-pagination-btns {
								width: 100%;
								justify-content: center;
							}
						}
					`}</style>

					<div className="emp-pagination">
						<p className="emp-pagination-count">
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

						<div className="emp-pagination-btns">
							{/* Previous */}
							<PaginationButton
								label="← Prev"
								ariaLabel="Go to previous page"
								disabled={!pagination.hasPreviousPage}
								onClick={() => onPageChange(pagination.page - 1)}
							/>

							{/* Current page indicator */}
							<span
								style={{
									display: "inline-flex",
									alignItems: "center",
									justifyContent: "center",
									minWidth: 32,
									height: 32,
									borderRadius: 8,
									background: "#1a7fd4",
									color: "#fff",
									fontSize: "0.8rem",
									fontWeight: 700,
									padding: "0 8px",
									userSelect: "none",
								}}
								aria-current="page"
								aria-label={`Page ${pagination.page} of ${pagination.totalPages}`}
							>
								{pagination.page}
							</span>

							{/* Next */}
							<PaginationButton
								label="Next →"
								ariaLabel="Go to next page"
								disabled={!pagination.hasNextPage}
								onClick={() => onPageChange(pagination.page + 1)}
							/>
						</div>
					</div>
				</>
			)}
		</div>
	);
}
