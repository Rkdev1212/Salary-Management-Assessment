import { useToast } from "@/hooks/use-toast";
import { employeeService } from "@/services/employee.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { EmployeeStatus, EmploymentType, SalaryBand } from "@repo/types";
import type { Employee } from "@repo/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Mail, X } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const employeeSchema = z.object({
	firstName: z.string().min(1, "First name is required"),
	lastName: z.string().min(1, "Last name is required"),
	email: z.string().email("Invalid email"),
	phone: z.string().min(10, "Phone must be at least 10 characters"),
	country: z.string().min(1, "Country is required"),
	currency: z.string().length(3, "Currency must be 3 characters"),
	salary: z.coerce.number().positive("Salary must be positive"),
	department: z.string().min(1, "Department is required"),
	jobTitle: z.string().min(1, "Job title is required"),
	employmentType: z.nativeEnum(EmploymentType),
	joiningDate: z.string().min(1, "Joining date is required"),
	status: z.nativeEnum(EmployeeStatus),
	salaryBand: z.nativeEnum(SalaryBand),
	bonusEligible: z.boolean(),
	location: z.string().min(1, "Location is required"),
	timezone: z.string().min(1, "Timezone is required"),
	managerName: z.string().optional(),
	performanceRating: z.coerce.number().min(1).max(5).optional().nullable(),
});

type EmployeeForm = z.infer<typeof employeeSchema>;

interface EmployeeDialogProps {
	open: boolean;
	onClose: () => void;
	employee: Employee | null;
}

// ── Reusable field components ────────────────────────────────────────────────

function Field({
	label,
	required,
	error,
	children,
}: {
	label: string;
	required?: boolean;
	error?: string;
	children: React.ReactNode;
}) {
	return (
		<div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
			<label
				style={{
					fontSize: "0.88rem",
					fontWeight: 500,
					color: "#374151",
					display: "flex",
					alignItems: "center",
					gap: 3,
				}}
			>
				{label}
				{required && (
					<span style={{ color: "#ef4444", fontSize: "0.8rem" }}>*</span>
				)}
			</label>
			{children}
			{error && (
				<p style={{ fontSize: "0.75rem", color: "#ef4444", margin: 0 }}>
					{error}
				</p>
			)}
		</div>
	);
}

const inputStyle: React.CSSProperties = {
	width: "100%",
	height: 44,
	padding: "0 14px",
	borderRadius: 10,
	border: "1.5px solid #e5e7eb",
	fontSize: "0.9rem",
	color: "#1e293b",
	background: "#fff",
	outline: "none",
	boxSizing: "border-box",
	transition: "border-color 0.15s",
	fontFamily: "inherit",
};

function StyledInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
	return (
		<input
			{...props}
			style={{ ...inputStyle, ...props.style }}
			onFocus={(e) => {
				e.target.style.borderColor = "#93c5fd";
			}}
			onBlur={(e) => {
				e.target.style.borderColor = "#e5e7eb";
			}}
		/>
	);
}

function StyledSelect(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
	return (
		<select
			{...props}
			style={{
				...inputStyle,
				appearance: "none",
				backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
				backgroundRepeat: "no-repeat",
				backgroundPosition: "right 12px center",
				paddingRight: 36,
				cursor: "pointer",
				...props.style,
			}}
			onFocus={(e) => {
				(e.target as HTMLSelectElement).style.borderColor = "#93c5fd";
			}}
			onBlur={(e) => {
				(e.target as HTMLSelectElement).style.borderColor = "#e5e7eb";
			}}
		/>
	);
}

// ── Dialog ───────────────────────────────────────────────────────────────────

export function EmployeeDialog({
	open,
	onClose,
	employee,
}: EmployeeDialogProps) {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<EmployeeForm>({
		resolver: zodResolver(employeeSchema),
		defaultValues: { status: EmployeeStatus.ACTIVE, bonusEligible: false },
	});

	useEffect(() => {
		if (employee) {
			reset({
				...employee,
				joiningDate: new Date(employee.joiningDate).toISOString().split("T")[0],
				performanceRating: employee.performanceRating ?? undefined,
				managerName: employee.managerName ?? undefined,
			});
		} else {
			reset({
				firstName: "",
				lastName: "",
				email: "",
				phone: "",
				country: "",
				currency: "USD",
				salary: 0,
				department: "",
				jobTitle: "",
				employmentType: EmploymentType.FULL_TIME,
				joiningDate: new Date().toISOString().split("T")[0],
				status: EmployeeStatus.ACTIVE,
				salaryBand: SalaryBand.MID,
				bonusEligible: false,
				location: "",
				timezone: "America/New_York",
			});
		}
	}, [employee, reset]);

	const createMutation = useMutation({
		mutationFn: employeeService.create,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["employees"] });
			toast({ title: "Success", description: "Employee created successfully" });
			onClose();
		},
		onError: () =>
			toast({
				variant: "destructive",
				title: "Error",
				description: "Failed to create employee",
			}),
	});

	const updateMutation = useMutation({
		mutationFn: ({ id, data }: { id: string; data: Partial<EmployeeForm> }) =>
			employeeService.update(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["employees"] });
			toast({ title: "Success", description: "Employee updated successfully" });
			onClose();
		},
		onError: () =>
			toast({
				variant: "destructive",
				title: "Error",
				description: "Failed to update employee",
			}),
	});

	const isPending = createMutation.isPending || updateMutation.isPending;

	const onSubmit = (data: EmployeeForm) => {
		const payload = {
			...data,
			joiningDate: new Date(data.joiningDate),
			performanceRating: data.performanceRating || null,
			managerName: data.managerName || null,
		};
		if (employee) {
			updateMutation.mutate({ id: employee.id, data: payload });
		} else {
			createMutation.mutate(payload);
		}
	};

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
					background: "rgba(15,23,42,0.45)",
					backdropFilter: "blur(3px)",
					zIndex: 100,
				}}
			/>

			{/* Modal */}
			<div
				style={{
					position: "fixed",
					top: "50%",
					left: "50%",
					transform: "translate(-50%,-50%)",
					zIndex: 101,
					width: "min(680px, 95vw)",
					maxHeight: "90vh",
					background: "#fff",
					borderRadius: 20,
					boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
					display: "flex",
					flexDirection: "column",
					fontFamily: "'Segoe UI', system-ui, sans-serif",
					overflow: "hidden",
				}}
			>
				{/* ── Header ── */}
				<div
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						padding: "22px 28px 18px",
						borderBottom: "1px solid #f1f5f9",
						flexShrink: 0,
					}}
				>
					<h2
						style={{
							margin: 0,
							fontSize: "1.15rem",
							fontWeight: 700,
							color: "#0f172a",
						}}
					>
						{employee ? "Edit Employee" : "Add Employee"}
					</h2>
					<button
						type="button"
						onClick={onClose}
						style={{
							background: "#f8fafc",
							border: "none",
							borderRadius: 8,
							width: 32,
							height: 32,
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							cursor: "pointer",
							color: "#64748b",
							transition: "all 0.15s",
						}}
						onMouseEnter={(e) => {
							(e.currentTarget as HTMLElement).style.background = "#fee2e2";
							(e.currentTarget as HTMLElement).style.color = "#ef4444";
						}}
						onMouseLeave={(e) => {
							(e.currentTarget as HTMLElement).style.background = "#f8fafc";
							(e.currentTarget as HTMLElement).style.color = "#64748b";
						}}
					>
						<X size={16} />
					</button>
				</div>

				{/* ── Scrollable body ── */}
				<div style={{ overflowY: "auto", padding: "24px 28px", flex: 1 }}>
					<form
						id="employee-form"
						onSubmit={handleSubmit(onSubmit)}
						style={{ display: "flex", flexDirection: "column", gap: 18 }}
					>
						{/* Row 1 — Name */}
						<div
							style={{
								display: "grid",
								gridTemplateColumns: "1fr 1fr",
								gap: 14,
							}}
							className="form-grid"
						>
							<Field
								label="First Name"
								required
								error={errors.firstName?.message}
							>
								<StyledInput
									id="firstName"
									{...register("firstName")}
									placeholder="John"
								/>
							</Field>
							<Field
								label="Last Name"
								required
								error={errors.lastName?.message}
							>
								<StyledInput
									id="lastName"
									{...register("lastName")}
									placeholder="Smith"
								/>
							</Field>
						</div>

						{/* Row 2 — Contact */}
						<div
							style={{
								display: "grid",
								gridTemplateColumns: "1fr 1fr",
								gap: 14,
							}}
							className="form-grid"
						>
							<Field label="Email" required error={errors.email?.message}>
								<StyledInput
									id="email"
									type="email"
									{...register("email")}
									placeholder="john@company.com"
								/>
							</Field>
							<Field label="Phone" required error={errors.phone?.message}>
								<StyledInput
									id="phone"
									{...register("phone")}
									placeholder="+1 234 567 8900"
								/>
							</Field>
						</div>

						{/* Row 3 — Role */}
						<div
							style={{
								display: "grid",
								gridTemplateColumns: "1fr 1fr",
								gap: 14,
							}}
							className="form-grid"
						>
							<Field
								label="Department"
								required
								error={errors.department?.message}
							>
								<StyledInput
									id="department"
									{...register("department")}
									placeholder="Engineering"
								/>
							</Field>
							<Field
								label="Job Title"
								required
								error={errors.jobTitle?.message}
							>
								<StyledInput
									id="jobTitle"
									{...register("jobTitle")}
									placeholder="Senior Developer"
								/>
							</Field>
						</div>

						{/* Row 4 — Pay */}
						<div
							style={{
								display: "grid",
								gridTemplateColumns: "1fr 1fr 1fr",
								gap: 14,
							}}
							className="form-grid-3"
						>
							<Field label="Country" required error={errors.country?.message}>
								<StyledInput
									id="country"
									{...register("country")}
									placeholder="US"
								/>
							</Field>
							<Field label="Currency" required error={errors.currency?.message}>
								<StyledInput
									id="currency"
									{...register("currency")}
									maxLength={3}
									placeholder="USD"
								/>
							</Field>
							<Field label="Salary" required error={errors.salary?.message}>
								<StyledInput
									id="salary"
									type="number"
									{...register("salary")}
									placeholder="75000"
								/>
							</Field>
						</div>

						{/* Row 5 — Employment */}
						<div
							style={{
								display: "grid",
								gridTemplateColumns: "1fr 1fr",
								gap: 14,
							}}
							className="form-grid"
						>
							<Field label="Employment Type" required>
								<StyledSelect {...register("employmentType")}>
									{Object.values(EmploymentType).map((t) => (
										<option key={t} value={t}>
											{t.replace(/_/g, " ")}
										</option>
									))}
								</StyledSelect>
							</Field>
							<Field label="Salary Band" required>
								<StyledSelect {...register("salaryBand")}>
									{Object.values(SalaryBand).map((b) => (
										<option key={b} value={b}>
											{b}
										</option>
									))}
								</StyledSelect>
							</Field>
						</div>

						{/* Row 6 — Dates / Status */}
						<div
							style={{
								display: "grid",
								gridTemplateColumns: "1fr 1fr",
								gap: 14,
							}}
							className="form-grid"
						>
							<Field
								label="Joining Date"
								required
								error={errors.joiningDate?.message}
							>
								<StyledInput
									id="joiningDate"
									type="date"
									{...register("joiningDate")}
								/>
							</Field>
							<Field label="Status" required>
								<StyledSelect {...register("status")}>
									{Object.values(EmployeeStatus).map((s) => (
										<option key={s} value={s}>
											{s.replace(/_/g, " ")}
										</option>
									))}
								</StyledSelect>
							</Field>
						</div>

						{/* Row 7 — Location */}
						<div
							style={{
								display: "grid",
								gridTemplateColumns: "1fr 1fr",
								gap: 14,
							}}
							className="form-grid"
						>
							<Field label="Location" required error={errors.location?.message}>
								<StyledInput
									id="location"
									{...register("location")}
									placeholder="New York, NY"
								/>
							</Field>
							<Field label="Timezone" required error={errors.timezone?.message}>
								<StyledInput
									id="timezone"
									{...register("timezone")}
									placeholder="America/New_York"
								/>
							</Field>
						</div>

						{/* Info notice — matches image */}
						<div
							style={{
								display: "flex",
								alignItems: "flex-start",
								gap: 12,
								padding: "14px 16px",
								background: "#f8fafc",
								borderRadius: 12,
								border: "1.5px solid #e2e8f0",
							}}
						>
							<div
								style={{
									flexShrink: 0,
									marginTop: 1,
									width: 32,
									height: 32,
									background: "#eff6ff",
									borderRadius: 8,
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
								}}
							>
								<Mail size={16} color="#1a7fd4" />
							</div>
							<p
								style={{
									margin: 0,
									fontSize: "0.85rem",
									color: "#64748b",
									lineHeight: 1.6,
								}}
							>
								The system generates a temporary password and emails the login
								link to the employee.
							</p>
						</div>
					</form>
				</div>

				{/* ── Footer ── */}
				<div
					style={{
						display: "flex",
						justifyContent: "flex-end",
						gap: 10,
						padding: "18px 28px",
						borderTop: "1px solid #f1f5f9",
						flexShrink: 0,
					}}
				>
					<button
						type="button"
						onClick={onClose}
						style={{
							padding: "10px 24px",
							borderRadius: 10,
							border: "1.5px solid #e2e8f0",
							background: "#fff",
							color: "#475569",
							fontSize: "0.9rem",
							fontWeight: 500,
							cursor: "pointer",
							transition: "all 0.15s",
							fontFamily: "inherit",
						}}
						onMouseEnter={(e) => {
							(e.currentTarget as HTMLElement).style.background = "#f8fafc";
							(e.currentTarget as HTMLElement).style.borderColor = "#cbd5e1";
						}}
						onMouseLeave={(e) => {
							(e.currentTarget as HTMLElement).style.background = "#fff";
							(e.currentTarget as HTMLElement).style.borderColor = "#e2e8f0";
						}}
					>
						Cancel
					</button>
					<button
						type="submit"
						form="employee-form"
						disabled={isPending}
						style={{
							padding: "10px 28px",
							borderRadius: 10,
							border: "none",
							background: isPending
								? "#7fb8e8"
								: "linear-gradient(135deg,#1a7fd4,#0f5fa8)",
							color: "#fff",
							fontSize: "0.9rem",
							fontWeight: 600,
							cursor: isPending ? "not-allowed" : "pointer",
							boxShadow: isPending ? "none" : "0 3px 10px rgba(26,127,212,0.3)",
							transition: "opacity 0.15s",
							fontFamily: "inherit",
						}}
						onMouseEnter={(e) => {
							if (!isPending)
								(e.currentTarget as HTMLElement).style.opacity = "0.9";
						}}
						onMouseLeave={(e) => {
							(e.currentTarget as HTMLElement).style.opacity = "1";
						}}
					>
						{isPending
							? "Saving…"
							: employee
								? "Update Employee"
								: "Add Employee"}
					</button>
				</div>
			</div>

			{/* Responsive grid styles */}
			<style>{`
        @media (max-width: 540px) {
          .form-grid, .form-grid-3 {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
		</>
	);
}
