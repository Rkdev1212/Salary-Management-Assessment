import React, { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { employeeService } from "@/services/employee.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { EmployeeStatus, EmploymentType, SalaryBand } from "@repo/types";
import type {
	Employee,
	CreateEmployeeDto,
	UpdateEmployeeDto,
} from "@repo/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Mail, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const employeeSchema = z.object({
	firstName: z.string().min(1, "First name is required"),
	lastName: z.string().min(1, "Last name is required"),
	email: z.string().email("Invalid email"),
	phone: z.string().min(10, "Phone must be at least 10 characters"),
	country: z.string().min(1, "Country is required"),
	currency: z.string().length(3, "Currency must be 3 characters"),

	salary: z.coerce
		.number({
			required_error: "Salary is required",
			invalid_type_error: "Salary must be a number",
		})
		.positive("Salary must be positive"),

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
			<div
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
			</div>

			{children}

			{error && (
				<p
					style={{
						fontSize: "0.75rem",
						color: "#ef4444",
						margin: 0,
					}}
				>
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

const StyledInput = React.forwardRef<
	HTMLInputElement,
	React.InputHTMLAttributes<HTMLInputElement>
>(({ onBlur, onFocus, style, ...rest }, ref) => {
	return (
		<input
			ref={ref}
			{...rest}
			style={{ ...inputStyle, ...style }}
			onFocus={(e) => {
				e.currentTarget.style.borderColor = "#93c5fd";
				onFocus?.(e);
			}}
			onBlur={(e) => {
				e.currentTarget.style.borderColor = "#e5e7eb";
				onBlur?.(e);
			}}
		/>
	);
});

StyledInput.displayName = "StyledInput";

const StyledSelect = React.forwardRef<
	HTMLSelectElement,
	React.SelectHTMLAttributes<HTMLSelectElement>
>(({ onBlur, onFocus, style, ...rest }, ref) => {
	return (
		<select
			ref={ref}
			{...rest}
			style={{
				...inputStyle,
				appearance: "none",
				backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
				backgroundRepeat: "no-repeat",
				backgroundPosition: "right 12px center",
				paddingRight: 36,
				cursor: "pointer",
				...style,
			}}
			onFocus={(e) => {
				e.currentTarget.style.borderColor = "#93c5fd";
				onFocus?.(e);
			}}
			onBlur={(e) => {
				e.currentTarget.style.borderColor = "#e5e7eb";
				onBlur?.(e);
			}}
		/>
	);
});

StyledSelect.displayName = "StyledSelect";

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
		mode: "onSubmit",
		reValidateMode: "onChange",

		defaultValues: {
			firstName: "",
			lastName: "",
			email: "",
			phone: "",
			country: "",
			currency: "USD",
			salary: undefined,
			department: "",
			jobTitle: "",
			employmentType: EmploymentType.FULL_TIME,
			joiningDate: new Date().toISOString().split("T")[0],
			status: EmployeeStatus.ACTIVE,
			salaryBand: SalaryBand.MID,
			bonusEligible: false,
			location: "",
			timezone: "America/New_York",
			managerName: undefined,
			performanceRating: undefined,
		},
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
			reset({
				firstName: "",
				lastName: "",
				email: "",
				phone: "",
				country: "",
				currency: "USD",
				salary: undefined,
				department: "",
				jobTitle: "",
				employmentType: EmploymentType.FULL_TIME,
				joiningDate: new Date().toISOString().split("T")[0],
				status: EmployeeStatus.ACTIVE,
				salaryBand: SalaryBand.MID,
				bonusEligible: false,
				location: "",
				timezone: "America/New_York",
				managerName: undefined,
				performanceRating: undefined,
			});
		}
	}, [open, employee, reset]);

	const createMutation = useMutation({
		mutationFn: employeeService.create,

		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["employees"],
			});

			toast({
				title: "Success",
				description: "Employee created successfully",
			});

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
		mutationFn: ({
			id,
			data,
		}: {
			id: string;
			data: UpdateEmployeeDto;
		}) => employeeService.update(id, data),

		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["employees"],
			});

			toast({
				title: "Success",
				description: "Employee updated successfully",
			});

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
			<button
				type="button"
				onClick={onClose}
				style={{
					position: "fixed",
					inset: 0,
					background: "rgba(15,23,42,0.45)",
					backdropFilter: "blur(3px)",
					zIndex: 100,
					border: "none",
					padding: 0,
					cursor: "default",
				}}
				aria-label="Close dialog"
			/>

			<div
				style={{
					position: "fixed",
					top: "50%",
					left: "50%",
					transform: "translate(-50%,-50%)",
					zIndex: 101,
					width: "min(680px,95vw)",
					maxHeight: "90vh",
					background: "#fff",
					borderRadius: 20,
					boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
					display: "flex",
					flexDirection: "column",
					overflow: "hidden",
				}}
			>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						padding: "22px 28px 18px",
						borderBottom: "1px solid #f1f5f9",
					}}
				>
					<h2
						style={{
							margin: 0,
							fontSize: "1.15rem",
							fontWeight: 700,
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
						}}
					>
						<X size={16} />
					</button>
				</div>

				<div
					style={{
						overflowY: "auto",
						padding: "24px 28px",
						flex: 1,
					}}
				>
					<form
						id="employee-form"
						onSubmit={handleSubmit(onSubmit)}
						style={{
							display: "flex",
							flexDirection: "column",
							gap: 18,
						}}
					>
						<Field
							label="First Name"
							required
							error={errors.firstName?.message}
						>
							<StyledInput placeholder="John" {...register("firstName")} />
						</Field>

						<Field label="Last Name" required error={errors.lastName?.message}>
							<StyledInput placeholder="Smith" {...register("lastName")} />
						</Field>

						<Field label="Email" required error={errors.email?.message}>
							<StyledInput
								type="email"
								placeholder="john@company.com"
								{...register("email")}
							/>
						</Field>

						<Field label="Phone" required error={errors.phone?.message}>
							<StyledInput
								placeholder="+1 234 567 890"
								{...register("phone")}
							/>
						</Field>

						<Field
							label="Department"
							required
							error={errors.department?.message}
						>
							<StyledInput
								placeholder="Engineering"
								{...register("department")}
							/>
						</Field>

						<Field label="Job Title" required error={errors.jobTitle?.message}>
							<StyledInput
								placeholder="Senior Developer"
								{...register("jobTitle")}
							/>
						</Field>

						<Field label="Country" required error={errors.country?.message}>
							<StyledInput placeholder="US" {...register("country")} />
						</Field>

						<Field label="Currency" required error={errors.currency?.message}>
							<StyledInput
								maxLength={3}
								placeholder="USD"
								{...register("currency")}
							/>
						</Field>

						<Field label="Salary" required error={errors.salary?.message}>
							<StyledInput
								type="number"
								placeholder="75000"
								{...register("salary")}
							/>
						</Field>

						<Field label="Employment Type" required>
							<StyledSelect {...register("employmentType")}>
								{Object.values(EmploymentType).map((type) => (
									<option key={type} value={type}>
										{type}
									</option>
								))}
							</StyledSelect>
						</Field>

						<Field
							label="Joining Date"
							required
							error={errors.joiningDate?.message}
						>
							<StyledInput type="date" {...register("joiningDate")} />
						</Field>

						<Field label="Status" required>
							<StyledSelect {...register("status")}>
								{Object.values(EmployeeStatus).map((status) => (
									<option key={status} value={status}>
										{status}
									</option>
								))}
							</StyledSelect>
						</Field>

						<Field label="Salary Band" required>
							<StyledSelect {...register("salaryBand")}>
								{Object.values(SalaryBand).map((band) => (
									<option key={band} value={band}>
										{band}
									</option>
								))}
							</StyledSelect>
						</Field>

						<Field label="Location" required error={errors.location?.message}>
							<StyledInput placeholder="New York" {...register("location")} />
						</Field>

						<Field label="Timezone" required error={errors.timezone?.message}>
							<StyledInput
								placeholder="America/New_York"
								{...register("timezone")}
							/>
						</Field>

						<div
							style={{
								display: "flex",
								alignItems: "center",
								gap: 10,
								padding: 14,
								background: "#f8fafc",
								borderRadius: 12,
							}}
						>
							<Mail size={18} />
							<p
								style={{
									margin: 0,
									fontSize: "0.85rem",
									color: "#64748b",
								}}
							>
								System will send login details automatically.
							</p>
						</div>
					</form>
				</div>

				<div
					style={{
						display: "flex",
						justifyContent: "flex-end",
						gap: 12,
						padding: "18px 28px",
						borderTop: "1px solid #f1f5f9",
					}}
				>
					<button
						type="button"
						onClick={onClose}
						style={{
							padding: "10px 24px",
							borderRadius: 10,
							border: "1px solid #e2e8f0",
							background: "#fff",
							cursor: "pointer",
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
							background: "linear-gradient(135deg,#1a7fd4,#0f5fa8)",
							color: "#fff",
							cursor: "pointer",
						}}
					>
						{isPending
							? "Saving..."
							: employee
								? "Update Employee"
								: "Add Employee"}
					</button>
				</div>
			</div>
		</>
	);
}
