import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { GoogleLogin } from "@react-oauth/google";
import FrontendRoutes from "../shared/constants/frontendRoutes";
import Logo from "../components/Logo";
import { Eye, EyeOff, Check } from "lucide-react";
import toast from "react-hot-toast";

const schema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .regex(/^(?![^a-zA-Z]+$).+$/, "Name must contain at least one letter"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      ),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const getPasswordStrength = (value) => {
  let score = 0;
  if (value.length >= 8) score++;
  if (/[A-Z]/.test(value) || /[a-z]/.test(value)) {
    if (/[0-9]/.test(value)) score++;
  }
  if (/[A-Z]/.test(value) && /[a-z]/.test(value) && /[0-9]/.test(value))
    score++;
  if (/[^A-Za-z0-9]/.test(value) && score >= 3) score++;
  return score;
};

const strengthColors = ["#e24b4a", "#ef9f27", "#3b82f6", "#1d9e75"];
const strengthLabels = [
  "Weak (min 8 chars)",
  "Fair (add numbers)",
  "Good (mix upper/lower)",
  "Strong",
];

const Signup = () => {
  const { signup, googleLogin } = useAuth();
  const navigate = useNavigate();
  const [pwValue, setPwValue] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");
  const passwordsMatch =
    password && confirmPassword && password === confirmPassword;

  const onSubmit = async (data) => {
    try {
      await signup(data.email, data.password, data.name);
      toast.success("Account created successfully!");
      navigate(FrontendRoutes.DASHBOARD);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error signing up");
    }
  };

  const handleGoogleSuccess = async (response) => {
    try {
      await googleLogin(response.credential);
      toast.success("Logged in with Google!");
      navigate(FrontendRoutes.DASHBOARD);
    } catch (err) {
      console.error(err);
      toast.error("Google login failed");
    }
  };

  const pwStrength = getPasswordStrength(pwValue);

  return (
    <div className="min-h-screen flex items-center justify-center bg-(--bg-main) w-full px-4 text-(--text-primary) transition-colors duration-300">
      <div className="flex w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl border border-stone-200">
        {/* Left Panel */}
        <div className="hidden md:flex flex-col justify-between flex-1 bg-[#1a1814] px-10 py-12 dark:bg-[#0a0908] transition-colors duration-300">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <Logo />
            <div className="leading-none">
              <span className="font-serif text-[#faf8f4] text-[15px] tracking-tight block">
                Schedule
              </span>
              <span className="font-serif italic text-[#c8b99a] text-[11px] tracking-tight block -mt-0.5">
                Pro
              </span>
            </div>
          </div>

          {/* Tagline */}
          <p className="font-serif italic text-[#faf8f4] text-4xl leading-snug tracking-tight">
            A few details
            <br />
            and you&apos;re
            <br />
            <span className="not-italic text-[#c8b99a]">ready to go.</span>
          </p>

          {/* Steps */}
          <div className="flex flex-col gap-4">
            {[
              {
                n: 1,
                title: "Create your account",
                desc: "Name, email, password — done.",
              },
              {
                n: 2,
                title: "Set up your workspace",
                desc: "Invite your team and configure settings.",
              },
              {
                n: 3,
                title: "Start working",
                desc: "Jump straight into your dashboard.",
              },
            ].map(({ n, title, desc }) => (
              <div key={n} className="flex items-start gap-3">
                <span className="w-5.5 h-5.5 mt-0.5 shrink-0 rounded-full bg-[#2e2b26] border border-[#3e3b36] flex items-center justify-center text-[11px] text-[#c8b99a]">
                  {n}
                </span>
                <div>
                  <p className="text-[13px] text-[#c8b99a] font-medium leading-none mb-0.5">
                    {title}
                  </p>
                  <p className="text-[13px] text-[#6b6760] leading-snug">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-[#6b6760] tracking-wide">
            © 2026 · Secure access
          </p>
        </div>

        {/* Right Panel — Form */}
        <div className="w-full md:w-90 shrink-0 bg-(--bg-card) px-9 py-12 flex flex-col justify-center transition-colors duration-300">
          <h2 className="font-serif text-(--text-primary) text-2xl tracking-tight mb-1">
            Create account
          </h2>
          <p className="text-sm text-stone-400 font-light mb-7">
            Takes less than a minute
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
          >
            <div>
              <label className="block text-[11px] font-medium uppercase tracking-widest text-stone-500 mb-1.5">
                Full name
              </label>
              <input
                {...register("name")}
                placeholder="John Doe"
                className="w-full px-3.5 py-2.5 rounded-lg border border-(--border-color) bg-(--bg-card) text-sm text-(--text-primary) placeholder-stone-400 focus:outline-none focus:border-(--accent-color) focus:ring-2 focus:ring-(--accent-color)/10 transition-all"
              />
              {errors.name && (
                <p className="text-[11px] text-red-600 mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-medium uppercase tracking-widest text-stone-500 mb-1.5">
                Email
              </label>
              <input
                {...register("email")}
                type="email"
                placeholder="john@example.com"
                className="w-full px-3.5 py-2.5 rounded-lg border border-(--border-color) bg-(--bg-card) text-sm text-(--text-primary) placeholder-stone-400 focus:outline-none focus:border-(--accent-color) focus:ring-2 focus:ring-(--accent-color)/10 transition-all"
              />
              {errors.email && (
                <p className="text-[11px] text-red-600 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-medium uppercase tracking-widest text-stone-500 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  onChange={(e) => {
                    register("password").onChange(e);
                    setPwValue(e.target.value);
                  }}
                  className="w-full px-3.5 py-2.5 pr-10 rounded-lg border border-(--border-color) bg-(--bg-card) text-sm text-(--text-primary) placeholder-stone-400 focus:outline-none focus:border-(--accent-color) focus:ring-2 focus:ring-(--accent-color)/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <div className="flex gap-1 mt-2">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-0.75 flex-1 rounded-full transition-all duration-200"
                    style={{
                      background:
                        pwValue.length > 0 && i < pwStrength
                          ? strengthColors[pwStrength - 1]
                          : "var(--divider-color)",
                    }}
                  />
                ))}
              </div>
              <p
                className="text-[11px] mt-1 transition-colors"
                style={{
                  color:
                    pwValue.length === 0
                      ? "#b0ada8"
                      : strengthColors[Math.max(0, pwStrength - 1)],
                }}
              >
                {pwValue.length === 0
                  ? "At least 8 chars, 1 upper, 1 lower, 1 num, 1 spec"
                  : strengthLabels[pwStrength - 1]}
              </p>
              {errors.password && (
                <p className="text-[11px] text-red-600 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-medium uppercase tracking-widest text-stone-500">
                  Confirm Password
                </label>
                {passwordsMatch && (
                  <div className="flex items-center gap-1 text-[10px] text-green-600 font-bold uppercase tracking-wider">
                    <Check size={12} strokeWidth={3} />
                    <span>Match</span>
                  </div>
                )}
              </div>
              <div className="relative">
                <input
                  {...register("confirmPassword")}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 pr-10 rounded-lg border border-(--border-color) bg-(--bg-card) text-sm text-(--text-primary) placeholder-stone-400 focus:outline-none focus:border-(--accent-color) focus:ring-2 focus:ring-(--accent-color)/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 focus:outline-none"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-[11px] text-red-600 mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-(--text-primary) text-(--bg-main) py-3 rounded-lg text-sm font-medium tracking-wide hover:opacity-90 active:scale-[0.98] transition-all mt-1"
            >
              Create account
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <hr className="flex-1 border-(--border-color)" />
            <span className="text-[11px] text-stone-400 uppercase tracking-widest px-2">or</span>
            <hr className="flex-1 border-(--border-color)" />
          </div>

          <div className="flex justify-center mb-6">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => toast.error("Google Signup Failed")}
              theme="outline"
              shape="pill"
            />
          </div>

          <p className="text-center text-sm text-stone-400">
            <Link
              to="/login"
              className="text-(--accent-color) font-medium hover:underline"
            >
              already a member? Log in instead →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
