import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import FrontendRoutes from "../shared/constants/frontendRoutes";
import Logo from "../components/Logo";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { GoogleLogin } from "@react-oauth/google";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});

const Login = () => {
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password);
      toast.success("Welcome back!");
      navigate(FrontendRoutes.DASHBOARD);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error logging in");
    }
  };

  const handleGoogleSuccess = async (response) => {
    try {
      await googleLogin(response.credential);
      toast.success("Successfully logged in!");
      navigate(FrontendRoutes.DASHBOARD);
    } catch (err) {
      console.error("Google Login Error:", err);
      toast.error("Google login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-(--bg-main) w-full px-4 transition-colors duration-300">
      <div className="flex w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl border border-stone-200">
        {/* Left Panel */}
        <div className="hidden md:flex flex-col justify-between flex-1 bg-[#1a1814] px-10 py-12 dark:bg-[#0a0908] transition-colors duration-300">
          <div className="flex items-center gap-2.5">
            <Logo />
            <div className="leading-none">
              <span className="font-serif text-[#f5f2ec] text-[15px] tracking-tight block transition-colors">
                Schedule
              </span>
              <span className="font-serif italic text-[#c8b99a] text-[11px] tracking-tight block -mt-0.5 transition-colors">
                Pro
              </span>
            </div>
          </div>

          <p className="font-serif italic text-[#faf8f4] text-4xl leading-snug tracking-tight">
            Good work
            <br />
            starts with
            <br />
            <span className="not-italic text-[#c8b99a]">signing in.</span>
          </p>
          <p className="text-xs text-[#6b6760] tracking-wide">
            © 2026 · Secure access
          </p>
        </div>

        {/* Right Panel — Form */}
        <div className="w-full md:w-85 shrink-0 bg-(--bg-card) px-9 py-12 flex flex-col justify-center transition-colors duration-300">
          <h2 className="font-serif text-[#1a1814] text-2xl tracking-tight mb-1">
            Welcome back
          </h2>
          <p className="text-sm text-stone-400 font-light mb-8">
            Let&apos;s get you back to your schedule.
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
            noValidate
          >
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
              {errors.password && (
                <p className="text-[11px] text-red-600 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-(--text-primary) text-(--bg-main) py-3 rounded-lg text-sm font-medium tracking-wide hover:opacity-90 active:scale-[0.98] transition-all mt-2"
            >
              Log in
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <hr className="flex-1 border-(--border-color)" />
            <span className="text-[11px] text-stone-400 uppercase tracking-widest">
              or continue with
            </span>
            <hr className="flex-1 border-(--border-color)" />
          </div>

          <div className="flex justify-center mb-6">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => toast.error("Google login failed")}
              useOneTap
              theme="outline"
              size="large"
              shape="pill"
              width="310"
            />
          </div>

          <p className="text-center text-sm text-stone-400">
            <Link
              to="/signup"
              className="text-(--accent-color) font-medium hover:underline"
            >
              Don&apos;t have an account? Sign up →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
