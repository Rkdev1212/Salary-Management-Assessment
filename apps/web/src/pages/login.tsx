import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import { useToast } from "@/hooks/use-toast";
import {
	Mail,
	Lock,
	Eye,
	EyeOff,
	BarChart2,
	Shield,
	Users,
	ArrowRight,
} from "lucide-react";

const loginSchema = z.object({
	email: z.string().email("Invalid email address"),
	password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

function useIsMobile() {
	const [isMobile, setIsMobile] = useState(false);
	useEffect(() => {
		const check = () => setIsMobile(window.innerWidth < 768);
		check();
		window.addEventListener("resize", check);
		return () => window.removeEventListener("resize", check);
	}, []);
	return isMobile;
}

export function LoginPage() {
	const navigate = useNavigate();
	const { setUser } = useAuthStore();
	const { toast } = useToast();
	const [isLoading, setIsLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [apiError, setApiError] = useState<string | null>(null);
	const isMobile = useIsMobile();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginForm>({
		resolver: zodResolver(loginSchema),
	});

	const onSubmit = async (data: LoginForm) => {
		setIsLoading(true);
		setApiError(null);
		try {
			const response = await authService.login(data);
			setUser(response.user);
			toast({ title: "Success", description: "Logged in successfully" });
			navigate("/dashboard");
		} catch {
			setApiError("Invalid credentials. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div
			style={{
				minHeight: "100vh",
				display: "flex",
				flexDirection: isMobile ? "column" : "row",
				background: "linear-gradient(135deg, #e8f4fd 0%, #ddeeff 100%)",
				fontFamily: "'Segoe UI', system-ui, sans-serif",
			}}
		>
			{/* ── Left / Top Branding Panel ── */}
			<div
				style={{
					flex: isMobile ? "0 0 auto" : 1,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					padding: isMobile ? "36px 24px 28px" : "48px 40px",
					gap: isMobile ? "18px" : "28px",
				}}
			>
				{/* Logo */}
				<div
					style={{
						width: isMobile ? 58 : 72,
						height: isMobile ? 58 : 72,
						borderRadius: 18,
						background: "linear-gradient(135deg, #1a7fd4, #0f5fa8)",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						boxShadow: "0 8px 24px rgba(26,127,212,0.35)",
						flexShrink: 0,
					}}
				>
					<svg
						width="32"
						height="32"
						viewBox="0 0 38 38"
						fill="none"
						role="img"
						aria-labelledby="login-logo-title"
					>
						<title id="login-logo-title">Salary Management logo</title>
						<circle cx="12" cy="12" r="4" fill="white" opacity="0.9" />
						<circle cx="26" cy="12" r="4" fill="white" opacity="0.9" />
						<circle cx="12" cy="26" r="4" fill="white" opacity="0.9" />
						<circle cx="26" cy="26" r="4" fill="white" opacity="0.9" />
						<path
							d="M12 12 L26 26 M26 12 L12 26"
							stroke="white"
							strokeWidth="2.5"
							strokeLinecap="round"
							opacity="0.6"
						/>
					</svg>
				</div>

				{/* Title */}
				<div style={{ textAlign: "center" }}>
					<h1
						style={{
							fontSize: isMobile ? "1.75rem" : "2.4rem",
							fontWeight: 800,
							color: "#1a1a2e",
							margin: 0,
							lineHeight: 1.2,
						}}
					>
						Welcome to <span style={{ color: "#1a7fd4" }}>Salary</span>
						{isMobile ? " " : <br />}
						<span style={{ color: "#1a7fd4" }}>Management</span>
					</h1>
					<p
						style={{
							marginTop: 8,
							fontSize: isMobile ? "0.88rem" : "1rem",
							fontWeight: 600,
							color: "#555",
							letterSpacing: "0.02em",
						}}
					>
						Administrator Management Portal
					</p>
				</div>

				{/* Description — hidden on very small screens to save space */}
				{!isMobile && (
					<p
						style={{
							fontSize: "0.95rem",
							color: "#666",
							textAlign: "center",
							maxWidth: 340,
							lineHeight: 1.7,
							margin: 0,
						}}
					>
						Streamline your payroll process. Review submissions, manage
						approvals, and collaborate with your team efficiently.
					</p>
				)}

				{/* Feature icons */}
				<div
					style={{
						display: "flex",
						gap: isMobile ? "24px" : "40px",
						marginTop: isMobile ? 0 : 8,
					}}
				>
					{[
						{ Icon: BarChart2, label: "Analytics" },
						{ Icon: Shield, label: "Security" },
						{ Icon: Users, label: "Collaboration" },
					].map(({ Icon, label }) => (
						<div
							key={label}
							style={{
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								gap: 6,
							}}
						>
							<div
								style={{
									width: isMobile ? 38 : 44,
									height: isMobile ? 38 : 44,
									borderRadius: 12,
									background: "rgba(26,127,212,0.1)",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
								}}
							>
								<Icon size={isMobile ? 18 : 22} color="#1a7fd4" />
							</div>
							<span
								style={{ fontSize: "0.78rem", color: "#555", fontWeight: 500 }}
							>
								{label}
							</span>
						</div>
					))}
				</div>
			</div>

			{/* ── Right / Bottom Form Panel ── */}
			<div
				style={{
					display: "flex",
					alignItems: isMobile ? "flex-start" : "center",
					justifyContent: "center",
					padding: isMobile ? "0 16px 40px" : "40px 48px",
					flex: isMobile ? "1 1 auto" : "0 0 auto",
				}}
			>
				<div
					style={{
						background: "white",
						borderRadius: 20,
						boxShadow: "0 8px 40px rgba(0,0,0,0.10)",
						padding: isMobile ? "32px 24px" : "44px 40px",
						width: "100%",
						maxWidth: 420,
					}}
				>
					<h2
						style={{
							fontSize: isMobile ? "1.4rem" : "1.7rem",
							fontWeight: 700,
							color: "#1a1a2e",
							margin: "0 0 6px",
						}}
					>
						Sign In
					</h2>
					<p style={{ fontSize: "0.9rem", color: "#888", marginBottom: 24 }}>
						Enter your credentials to access your account
					</p>

					<form
						onSubmit={handleSubmit(onSubmit)}
						style={{ display: "flex", flexDirection: "column", gap: 18 }}
					>
						{/* Email */}
						<div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
							<Label
								htmlFor="email"
								style={{ fontSize: "0.88rem", fontWeight: 600, color: "#333" }}
							>
								Email Address
							</Label>
							<div style={{ position: "relative" }}>
								<Mail
									size={16}
									color="#aaa"
									style={{
										position: "absolute",
										left: 14,
										top: "50%",
										transform: "translateY(-50%)",
										pointerEvents: "none",
									}}
								/>
								<Input
									id="email"
									type="email"
									placeholder="admin@example.com"
									{...register("email")}
									style={{
										paddingLeft: 40,
										height: 46,
										borderRadius: 10,
										border: errors.email
											? "1.5px solid #e74c3c"
											: "1.5px solid #e0e0e0",
										fontSize: "0.93rem",
										background: "#fafafa",
										width: "100%",
										boxSizing: "border-box",
									}}
								/>
							</div>
							{errors.email && (
								<p style={{ fontSize: "0.8rem", color: "#e74c3c", margin: 0 }}>
									{errors.email.message}
								</p>
							)}
						</div>

						{/* Password */}
						<div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
							<Label
								htmlFor="password"
								style={{ fontSize: "0.88rem", fontWeight: 600, color: "#333" }}
							>
								Password
							</Label>
							<div style={{ position: "relative" }}>
								<Lock
									size={16}
									color="#aaa"
									style={{
										position: "absolute",
										left: 14,
										top: "50%",
										transform: "translateY(-50%)",
										pointerEvents: "none",
									}}
								/>
								<Input
									id="password"
									type={showPassword ? "text" : "password"}
									placeholder="••••••••"
									{...register("password")}
									style={{
										paddingLeft: 40,
										paddingRight: 44,
										height: 46,
										borderRadius: 10,
										border: errors.password
											? "1.5px solid #e74c3c"
											: "1.5px solid #e0e0e0",
										fontSize: "0.93rem",
										background: "#fafafa",
										width: "100%",
										boxSizing: "border-box",
									}}
								/>
								<button
									type="button"
									onClick={() => setShowPassword((v) => !v)}
									style={{
										position: "absolute",
										right: 12,
										top: "50%",
										transform: "translateY(-50%)",
										background: "none",
										border: "none",
										cursor: "pointer",
										padding: 0,
										display: "flex",
									}}
								>
									{showPassword ? (
										<EyeOff size={17} color="#aaa" />
									) : (
										<Eye size={17} color="#aaa" />
									)}
								</button>
							</div>
							{errors.password && (
								<p style={{ fontSize: "0.8rem", color: "#e74c3c", margin: 0 }}>
									{errors.password.message}
								</p>
							)}
						</div>

						{/* API error */}
						{apiError && (
							<div
								style={{
									background: "#fff0f0",
									border: "1.5px solid #f5c6c6",
									borderRadius: 8,
									padding: "10px 14px",
									fontSize: "0.88rem",
									color: "#c0392b",
								}}
							>
								{apiError}
							</div>
						)}

						{/* Submit */}
						<Button
							type="submit"
							disabled={isLoading}
							style={{
								height: 48,
								borderRadius: 10,
								background: isLoading
									? "#7fb8e8"
									: "linear-gradient(135deg, #1a7fd4, #0f5fa8)",
								color: "white",
								fontSize: "1rem",
								fontWeight: 600,
								border: "none",
								cursor: isLoading ? "not-allowed" : "pointer",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								gap: 8,
								boxShadow: isLoading
									? "none"
									: "0 4px 14px rgba(26,127,212,0.4)",
								transition: "all 0.2s",
								width: "100%",
							}}
						>
							{isLoading ? "Signing in..." : "Sign In"}
							{!isLoading && <ArrowRight size={18} />}
						</Button>
					</form>

					{/* Footer */}
					<p
						style={{
							textAlign: "center",
							fontSize: "0.85rem",
							color: "#888",
							marginTop: 22,
							marginBottom: 0,
						}}
					>
						Don't have an account?{" "}
						<a
							href="mailto:admin@yourcompany.com"
							style={{
								color: "#1a7fd4",
								fontWeight: 600,
								textDecoration: "none",
							}}
						>
							Contact your administrator
						</a>
					</p>
				</div>
			</div>
		</div>
	);
}
