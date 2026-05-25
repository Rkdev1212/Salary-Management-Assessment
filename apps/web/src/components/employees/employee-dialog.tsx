import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { employeeService } from "@/services/employee.service";
import { useToast } from "@/hooks/use-toast";
import { EmploymentType, EmployeeStatus, SalaryBand } from "@repo/types";
import type { Employee } from "@repo/types";

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
		setValue,
		watch,
		formState: { errors },
	} = useForm<EmployeeForm>({
		resolver: zodResolver(employeeSchema),
		defaultValues: {
			status: EmployeeStatus.ACTIVE,
			bonusEligible: false,
		},
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
		onError: () => {
			toast({
				variant: "destructive",
				title: "Error",
				description: "Failed to create employee",
			});
		},
	});

	const updateMutation = useMutation({
		mutationFn: ({ id, data }: { id: string; data: Partial<EmployeeForm> }) =>
			employeeService.update(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["employees"] });
			toast({ title: "Success", description: "Employee updated successfully" });
			onClose();
		},
		onError: () => {
			toast({
				variant: "destructive",
				title: "Error",
				description: "Failed to update employee",
			});
		},
	});

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

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>
						{employee ? "Edit Employee" : "Add Employee"}
					</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="firstName">First Name *</Label>
							<Input id="firstName" {...register("firstName")} />
							{errors.firstName && (
								<p className="text-sm text-destructive">
									{errors.firstName.message}
								</p>
							)}
						</div>
						<div className="space-y-2">
							<Label htmlFor="lastName">Last Name *</Label>
							<Input id="lastName" {...register("lastName")} />
							{errors.lastName && (
								<p className="text-sm text-destructive">
									{errors.lastName.message}
								</p>
							)}
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="email">Email *</Label>
							<Input id="email" type="email" {...register("email")} />
							{errors.email && (
								<p className="text-sm text-destructive">
									{errors.email.message}
								</p>
							)}
						</div>
						<div className="space-y-2">
							<Label htmlFor="phone">Phone *</Label>
							<Input id="phone" {...register("phone")} />
							{errors.phone && (
								<p className="text-sm text-destructive">
									{errors.phone.message}
								</p>
							)}
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="department">Department *</Label>
							<Input id="department" {...register("department")} />
							{errors.department && (
								<p className="text-sm text-destructive">
									{errors.department.message}
								</p>
							)}
						</div>
						<div className="space-y-2">
							<Label htmlFor="jobTitle">Job Title *</Label>
							<Input id="jobTitle" {...register("jobTitle")} />
							{errors.jobTitle && (
								<p className="text-sm text-destructive">
									{errors.jobTitle.message}
								</p>
							)}
						</div>
					</div>

					<div className="grid grid-cols-3 gap-4">
						<div className="space-y-2">
							<Label htmlFor="country">Country *</Label>
							<Input id="country" {...register("country")} />
							{errors.country && (
								<p className="text-sm text-destructive">
									{errors.country.message}
								</p>
							)}
						</div>
						<div className="space-y-2">
							<Label htmlFor="currency">Currency *</Label>
							<Input id="currency" {...register("currency")} maxLength={3} />
							{errors.currency && (
								<p className="text-sm text-destructive">
									{errors.currency.message}
								</p>
							)}
						</div>
						<div className="space-y-2">
							<Label htmlFor="salary">Salary *</Label>
							<Input id="salary" type="number" {...register("salary")} />
							{errors.salary && (
								<p className="text-sm text-destructive">
									{errors.salary.message}
								</p>
							)}
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label>Employment Type *</Label>
							<Select
								value={watch("employmentType")}
								onValueChange={(value) =>
									setValue("employmentType", value as EmploymentType)
								}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{Object.values(EmploymentType).map((type) => (
										<SelectItem key={type} value={type}>
											{type.replace("_", " ")}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label>Salary Band *</Label>
							<Select
								value={watch("salaryBand")}
								onValueChange={(value) =>
									setValue("salaryBand", value as SalaryBand)
								}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{Object.values(SalaryBand).map((band) => (
										<SelectItem key={band} value={band}>
											{band}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="joiningDate">Joining Date *</Label>
							<Input
								id="joiningDate"
								type="date"
								{...register("joiningDate")}
							/>
							{errors.joiningDate && (
								<p className="text-sm text-destructive">
									{errors.joiningDate.message}
								</p>
							)}
						</div>
						<div className="space-y-2">
							<Label>Status *</Label>
							<Select
								value={watch("status")}
								onValueChange={(value) =>
									setValue("status", value as EmployeeStatus)
								}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{Object.values(EmployeeStatus).map((status) => (
										<SelectItem key={status} value={status}>
											{status.replace("_", " ")}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="location">Location *</Label>
							<Input id="location" {...register("location")} />
							{errors.location && (
								<p className="text-sm text-destructive">
									{errors.location.message}
								</p>
							)}
						</div>
						<div className="space-y-2">
							<Label htmlFor="timezone">Timezone *</Label>
							<Input id="timezone" {...register("timezone")} />
							{errors.timezone && (
								<p className="text-sm text-destructive">
									{errors.timezone.message}
								</p>
							)}
						</div>
					</div>

					<DialogFooter>
						<Button type="button" variant="outline" onClick={onClose}>
							Cancel
						</Button>
						<Button
							type="submit"
							disabled={createMutation.isPending || updateMutation.isPending}
						>
							{createMutation.isPending || updateMutation.isPending
								? "Saving..."
								: employee
									? "Update"
									: "Create"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
