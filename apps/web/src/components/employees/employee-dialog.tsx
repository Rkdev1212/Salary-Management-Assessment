import { useToast } from "@/hooks/use-toast";
import { employeeService } from "@/services/employee.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { EmployeeStatus, EmploymentType, SalaryBand } from "@repo/types";
import type {
	CreateEmployeeDto,
	Employee,
	UpdateEmployeeDto,
} from "@repo/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserPlus, X } from "lucide-react";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// ─── Constants ────────────────────────────────────────────────────────────────

const EMPLOYEE_STATUS_OPTIONS = [
	EmployeeStatus.ACTIVE,
	EmployeeStatus.INACTIVE,
] as const;

const DEFAULT_FORM_VALUES = {
	firstName: "",
	lastName: "",
	email: "",
	phone: "",
	country: "",
	currency: "USD",
	salary: undefined as unknown as number,
	department: "",
	jobTitle: "",
	employmentType: EmploymentType.FULL_TIME,
	joiningDate: new Date().toISOString().split("T")[0],
	status: EmployeeStatus.ACTIVE,
	salaryBand: SalaryBand.MID,
	bonusEligible: false,
	location: "",
	timezone: "America/New_York",
	managerName: undefined as string | undefined,
	performanceRating: undefined as number | null | undefined,
};

// ─── Schema ───────────────────────────────────────────────────────────────────

const employeeSchema = z.object({
	firstName: z.string().min(1, "First name is required"),
	lastName: z.string().min(1, "Last name is required"),
	email: z.string().email("Invalid email"),
	phone: z.string().min(10, "Phone must be at least 10 characters"),
	country: z.string().min(1, "Country is required"),
	currency: z.string().length(3, "Must be 3 characters (e.g. USD)"),
	salary: z.coerce
		.number({
			required_error: "Salary is required",
			invalid_type_error: "Must be a number",
		})
		.positive("Must be positive"),
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

type EmployeeFormData = z.infer<typeof employeeSchema>;

// ─── Sub-components ───────────────────────────────────────────────────────────

const styles = {
	input: {
		width: "100%",
		height: 42,
		padding: "0 12px",
		borderRadius: 8,
		border: "1.5px solid #e2e8f0",
		fontSize: "0.875rem",
		color: "#1e293b",
		background: "#fff",
		outline: "none",
		boxSizing: "border-box" as const,
		fontFamily: "inherit",
		transition: "border-color 0.15s, box-shadow 0.15s",
	},
} as const;

const StyledInput = React.forwardRef<
	HTMLInputElement,
	React.InputHTMLAttributes<HTMLInputElement>
>(({ onBlur, onFocus, style, ...rest }, ref) => (
	<input
		ref={ref}
		{...rest}
		style={{ ...styles.input, ...style }}
		onFocus={(e) => {
			e.currentTarget.style.borderColor = "#3b82f6";
			e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.1)";
			onFocus?.(e);
		}}
		onBlur={(e) => {
			e.currentTarget.style.borderColor = "#e2e8f0";
			e.currentTarget.style.boxShadow = "none";
			onBlur?.(e);
		}}
	/>
));
StyledInput.displayName = "StyledInput";

const StyledSelect = React.forwardRef<
	HTMLSelectElement,
	React.SelectHTMLAttributes<HTMLSelectElement>
>(({ onBlur, onFocus, style, ...rest }, ref) => (
	<select
		ref={ref}
		{...rest}
		style={{
			...styles.input,
			appearance: "none",
			backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
			backgroundRepeat: "no-repeat",
			backgroundPosition: "right 10px center",
			paddingRight: 34,
			cursor: "pointer",
			...style,
		}}
		onFocus={(e) => {
			e.currentTarget.style.borderColor = "#3b82f6";
			e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.1)";
			onFocus?.(e);
		}}
		onBlur={(e) => {
			e.currentTarget.style.borderColor = "#e2e8f0";
			e.currentTarget.style.boxShadow = "none";
			onBlur?.(e);
		}}
	/>
));
StyledSelect.displayName = "StyledSelect";

function Field({
	label,
	required,
	error,
	children,
	fullWidth,
}: {
	label: string;
	required?: boolean;
	error?: string;
	children: React.ReactNode;
	fullWidth?: boolean;
}) {
	const generatedId = React.useId();
	const controlId = generatedId;
	const control = React.isValidElement<{ id?: string }>(children)
		? React.cloneElement(children, { id: children.props.id ?? controlId })
		: children;

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				gap: 5,
				gridColumn: fullWidth ? "1 / -1" : undefined,
			}}
		>
			<label
				htmlFor={controlId}
				style={{
					fontSize: "0.8rem",
					fontWeight: 600,
					color: "#475569",
					letterSpacing: "0.02em",
					display: "flex",
					alignItems: "center",
					gap: 3,
				}}
			>
				{label}
				{required && (
					<span
						style={{ color: "#ef4444", fontSize: "0.75rem" }}
						aria-hidden="true"
					>
						*
					</span>
				)}
			</label>
			{control}
			{error && (
				<p
					role="alert"
					style={{ fontSize: "0.72rem", color: "#ef4444", margin: 0 }}
				>
					{error}
				</p>
			)}
		</div>
	);
}

// ─── Section divider ──────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
	return (
		<div
			style={{
				gridColumn: "1 / -1",
				display: "flex",
				alignItems: "center",
				gap: 10,
				margin: "4px 0 2px",
			}}
		>
			<span
				style={{
					fontSize: "0.72rem",
					fontWeight: 700,
					color: "#94a3b8",
					letterSpacing: "0.08em",
					textTransform: "uppercase",
				}}
			>
				{children}
			</span>
			<div style={{ flex: 1, height: 1, background: "#f1f5f9" }} />
		</div>
	);
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface EmployeeDialogProps {
	open: boolean;
	onClose: () => void;
	employee: Employee | null;
}

// ─── Main component ───────────────────────────────────────────────────────────

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
	} = useForm<EmployeeFormData>({
		resolver: zodResolver(employeeSchema),
		mode: "onSubmit",
		reValidateMode: "onChange",
		defaultValues: DEFAULT_FORM_VALUES,
	});

	useEffect(() => {
		if (!open) return;

		if (employee) {
			reset({
				...employee,
				joiningDate: new Date(employee.joiningDate).toISOString().split("T")[0],
				performanceRating: employee.performanceRating ?? undefined,
				managerName: employee.managerName ?? undefined,
			});
		} else {
			reset(DEFAULT_FORM_VALUES);
		}
	}, [open, employee, reset]);

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
		mutationFn: ({ id, data }: { id: string; data: UpdateEmployeeDto }) =>
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
	const isEditing = Boolean(employee);

	const onSubmit = (data: EmployeeFormData) => {
		const payload = {
			...data,
			joiningDate: new Date(data.joiningDate),
			performanceRating: data.performanceRating ?? null,
			managerName: data.managerName || null,
		};

		if (isEditing && employee) {
			updateMutation.mutate({
				id: employee.id,
				data: payload as UpdateEmployeeDto,
			});
		} else {
			createMutation.mutate(payload as CreateEmployeeDto);
		}
	};

	if (!open) return null;

	return (
		<>
			{/* Backdrop */}
			<button
				type="button"
				aria-label="Close dialog"
				onClick={onClose}
				style={{
					position: "fixed",
					inset: 0,
					background: "rgba(15,23,42,0.5)",
					backdropFilter: "blur(4px)",
					zIndex: 100,
					border: "none",
					padding: 0,
					cursor: "default",
				}}
			/>

			{/* Dialog */}
			<dialog
				open
				aria-labelledby="dialog-title"
				style={{
					position: "fixed",
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
					zIndex: 101,
					width: "min(720px, 96vw)",
					maxHeight: "92vh",
					background: "#fff",
					borderRadius: 16,
					boxShadow: "0 32px 80px rgba(0,0,0,0.2)",
					display: "flex",
					flexDirection: "column",
					overflow: "hidden",
					border: "none",
					padding: 0,
				}}
			>
				{/* Colored header — matches reference design */}
				<div
					style={{
						background: "linear-gradient(135deg, #1a7fd4 0%, #0f5fa8 100%)",
						padding: "20px 28px",
						position: "relative",
						overflow: "hidden",
						flexShrink: 0,
					}}
				>
					{/* Decorative circles for depth */}
					<div
						aria-hidden="true"
						style={{
							position: "absolute",
							top: -30,
							right: -30,
							width: 120,
							height: 120,
							borderRadius: "50%",
							background: "rgba(255,255,255,0.08)",
						}}
					/>
					<div
						aria-hidden="true"
						style={{
							position: "absolute",
							bottom: -20,
							right: 60,
							width: 70,
							height: 70,
							borderRadius: "50%",
							background: "rgba(255,255,255,0.06)",
						}}
					/>

					<div
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
							gap: 16,
							position: "relative",
						}}
					>
						<div
							style={{
								display: "flex",
								alignItems: "center",
								gap: 12,
								minWidth: 0,
							}}
						>
							<div
								style={{
									width: 40,
									height: 40,
									borderRadius: 10,
									background: "rgba(255,255,255,0.18)",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
								}}
							>
								<UserPlus size={20} color="#fff" />
							</div>
							<div style={{ minWidth: 0 }}>
								<h2
									id="dialog-title"
									style={{
										margin: 0,
										fontSize: "1.1rem",
										fontWeight: 700,
										color: "#fff",
									}}
								>
									{isEditing ? "Edit Employee" : "Add New Employee"}
								</h2>
								<p
									style={{
										margin: 0,
										fontSize: "0.8rem",
										color: "rgba(255,255,255,0.72)",
										marginTop: 2,
									}}
								>
									{isEditing
										? "Update employee details below"
										: "Fill in the details to add a new employee"}
								</p>
							</div>
						</div>

						<button
							type="button"
							aria-label="Close dialog"
							onClick={onClose}
							style={{
								background: "rgba(255,255,255,0.15)",
								border: "none",
								borderRadius: 8,
								width: 32,
								height: 32,
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								cursor: "pointer",
								color: "#fff",
								flexShrink: 0,
							}}
						>
							<X size={16} />
						</button>
					</div>
				</div>

				{/* Scrollable form body */}
				<div
					style={{
						overflowY: "auto",
						padding: "24px 28px",
						flex: 1,
						minHeight: 0,
					}}
				>
					<form
						id="employee-form"
						onSubmit={handleSubmit(onSubmit)}
						noValidate
						style={{
							display: "grid",
							gridTemplateColumns: "1fr 1fr",
							gap: "16px 20px",
						}}
					>
						<SectionLabel>Personal Information</SectionLabel>

						<Field
							label="First Name"
							required
							error={errors.firstName?.message}
						>
							<StyledInput
								placeholder="John"
								autoComplete="given-name"
								aria-required="true"
								{...register("firstName")}
							/>
						</Field>

						<Field label="Last Name" required error={errors.lastName?.message}>
							<StyledInput
								placeholder="Smith"
								autoComplete="family-name"
								aria-required="true"
								{...register("lastName")}
							/>
						</Field>

						<Field label="Email" required error={errors.email?.message}>
							<StyledInput
								type="email"
								placeholder="john@company.com"
								autoComplete="email"
								aria-required="true"
								{...register("email")}
							/>
						</Field>

						<Field label="Phone" required error={errors.phone?.message}>
							<StyledInput
								type="tel"
								placeholder="+1 234 567 890"
								autoComplete="tel"
								aria-required="true"
								{...register("phone")}
							/>
						</Field>

						<Field label="Country" required error={errors.country?.message}>
							<StyledInput
								placeholder="US"
								autoComplete="country"
								aria-required="true"
								{...register("country")}
							/>
						</Field>

						<Field label="Location" required error={errors.location?.message}>
							<StyledInput
								placeholder="New York"
								aria-required="true"
								{...register("location")}
							/>
						</Field>

						<SectionLabel>Role & Employment</SectionLabel>

						<Field
							label="Department"
							required
							error={errors.department?.message}
						>
							<StyledInput
								placeholder="Engineering"
								aria-required="true"
								{...register("department")}
							/>
						</Field>

						<Field label="Job Title" required error={errors.jobTitle?.message}>
							<StyledInput
								placeholder="Senior Developer"
								aria-required="true"
								{...register("jobTitle")}
							/>
						</Field>

						<Field label="Employment Type" required>
							<StyledSelect
								aria-required="true"
								{...register("employmentType")}
							>
								{Object.values(EmploymentType).map((type) => (
									<option key={type} value={type}>
										{type}
									</option>
								))}
							</StyledSelect>
						</Field>

						<Field label="Status" required>
							<StyledSelect aria-required="true" {...register("status")}>
								{EMPLOYEE_STATUS_OPTIONS.map((status) => (
									<option key={status} value={status}>
										{status}
									</option>
								))}
							</StyledSelect>
						</Field>

						<Field
							label="Joining Date"
							required
							error={errors.joiningDate?.message}
						>
							<StyledInput
								type="date"
								aria-required="true"
								{...register("joiningDate")}
							/>
						</Field>

						{/* <Field label="Manager Name" error={errors.managerName?.message}>
							<StyledInput
								placeholder="Jane Doe (optional)"
								{...register("managerName")}
							/>
						</Field> */}

						<SectionLabel>Compensation</SectionLabel>

						<Field label="Salary" required error={errors.salary?.message}>
							<StyledInput
								type="number"
								placeholder="75000"
								min={0}
								aria-required="true"
								{...register("salary")}
							/>
						</Field>

						<Field label="Currency" required error={errors.currency?.message}>
							<StyledInput
								maxLength={3}
								placeholder="USD"
								aria-required="true"
								style={{ textTransform: "uppercase" }}
								{...register("currency")}
							/>
						</Field>

						<Field label="Salary Band" required>
							<StyledSelect aria-required="true" {...register("salaryBand")}>
								{Object.values(SalaryBand).map((band) => (
									<option key={band} value={band}>
										{band}
									</option>
								))}
							</StyledSelect>
						</Field>

						<Field
							label="Performance Rating"
							error={errors.performanceRating?.message}
						>
							<StyledInput
								type="number"
								placeholder="1–5 (optional)"
								min={1}
								max={5}
								step={0.1}
								{...register("performanceRating")}
							/>
						</Field>

						{/* Bonus eligible — full width checkbox row */}
						{/* <div
							style={{
								gridColumn: "1 / -1",
								display: "flex",
								alignItems: "center",
								gap: 10,
								padding: "12px 14px",
								background: "#f8fafc",
								borderRadius: 10,
								border: "1.5px solid #e2e8f0",
								cursor: "pointer",
							}}
						>
							<input
								id="bonusEligible"
								type="checkbox"
								style={{
									width: 16,
									height: 16,
									cursor: "pointer",
									accentColor: "#1a7fd4",
								}}
								{...register("bonusEligible")}
							/>
							<label
								htmlFor="bonusEligible"
								style={{
									fontSize: "0.875rem",
									color: "#374151",
									fontWeight: 500,
									cursor: "pointer",
								}}
							>
								Bonus eligible
							</label>
						</div> */}

						<SectionLabel>Locale</SectionLabel>

						<Field
							label="Timezone"
							required
							error={errors.timezone?.message}
							fullWidth
						>
							<StyledInput
								placeholder="America/New_York"
								aria-required="true"
								{...register("timezone")}
							/>
						</Field>
					</form>
				</div>

				{/* Footer actions */}
				<div
					style={{
						display: "flex",
						justifyContent: "flex-end",
						gap: 10,
						padding: "16px 28px",
						borderTop: "1px solid #f1f5f9",
						background: "#fafbfc",
						flexShrink: 0,
					}}
				>
					<button
						type="button"
						onClick={onClose}
						disabled={isPending}
						style={{
							padding: "10px 22px",
							borderRadius: 8,
							border: "1.5px solid #e2e8f0",
							background: "#fff",
							fontSize: "0.875rem",
							fontWeight: 500,
							color: "#374151",
							cursor: "pointer",
							fontFamily: "inherit",
						}}
					>
						Cancel
					</button>

					<button
						type="submit"
						form="employee-form"
						disabled={isPending}
						style={{
							padding: "10px 26px",
							borderRadius: 8,
							border: "none",
							background: isPending
								? "#93c5fd"
								: "linear-gradient(135deg, #1a7fd4 0%, #0f5fa8 100%)",
							color: "#fff",
							fontSize: "0.875rem",
							fontWeight: 600,
							cursor: isPending ? "not-allowed" : "pointer",
							fontFamily: "inherit",
							transition: "opacity 0.15s",
						}}
					>
						{isPending
							? "Saving…"
							: isEditing
								? "Update Employee"
								: "Add Employee"}
					</button>
				</div>
			</dialog>
		</>
	);
}
