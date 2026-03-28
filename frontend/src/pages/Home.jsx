import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";
import {
  Calendar,
  Clock,
  Link as LinkIcon,
  ArrowRight,
  Check,
  Zap,
  Shield,
  Globe,
  Sun,
  Moon,
} from "lucide-react";
import FrontendRoutes from "../shared/constants/frontendRoutes";
import Logo from "../components/Logo";

function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function Counter({ target, suffix = "" }) {
  const [count, setCount] = useState(0);
  const [ref, visible] = useReveal(0.3);
  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const step = Math.ceil(target / 60);
    const id = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(id);
      } else setCount(start);
    }, 16);
    return () => clearInterval(id);
  }, [visible, target]);
  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

function FeatureCard({ icon: IconComponent, title, body, delay }) {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      style={{
        transitionDelay: `${delay}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: "opacity 0.6s ease, transform 0.6s ease",
      }}
      className="bg-[--bg-card] border border-[--border-color] rounded-2xl p-6 group hover:border-[--accent-color]/30 transition-all duration-300"
    >
      <div className="w-10 h-10 rounded-xl bg-[--bg-main] flex items-center justify-center mb-4 group-hover:bg-[--accent-color]/10 transition-colors">
        <IconComponent className="w-5 h-5 text-[--accent-color]" />
      </div>
      <h3 className="font-serif text-[--text-primary] text-[17px] mb-2">
        {title}
      </h3>
      <p className="text-[13px] text-[--text-secondary] leading-relaxed">
        {body}
      </p>
    </div>
  );
}

function Step({ num, title, body, delay }) {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      style={{
        transitionDelay: `${delay}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0)" : "translateX(-20px)",
        transition: "opacity 0.6s ease, transform 0.6s ease",
      }}
      className="flex gap-5"
    >
      <div className="shrink-0 w-9 h-9 rounded-full border border-[--accent-color]/30 flex items-center justify-center">
        <span className="font-serif text-[--accent-color] text-[14px]">
          {num}
        </span>
      </div>
      <div className="pt-1">
        <h4 className="font-serif text-[--text-primary] text-[15px] mb-1">
          {title}
        </h4>
        <p className="text-[13px] text-[--text-secondary] leading-relaxed">
          {body}
        </p>
      </div>
    </div>
  );
}

const Home = () => {
  const { theme, toggleTheme } = useTheme();
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setHeroVisible(true), 60);
    return () => clearTimeout(id);
  }, []);

  const features = [
    {
      icon: Calendar,
      title: "Google Calendar sync",
      body: "Connect once and all your events flow automatically — no double bookings, ever.",
    },
    {
      icon: LinkIcon,
      title: "Shareable booking link",
      body: "One personal link lets anyone schedule time with you in seconds, no back-and-forth.",
    },
    {
      icon: Clock,
      title: "Smart availability",
      body: "Define your windows, buffer times, and limits. We handle the rest.",
    },
    {
      icon: Zap,
      title: "Instant confirmations",
      body: "Both you and your guest receive immediate email confirmations the moment a slot is booked.",
    },
    {
      icon: Globe,
      title: "Timezone-aware",
      body: "Your availability is shown in each guest's local timezone — no confusion, no missed calls.",
    },
    {
      icon: Shield,
      title: "Private by default",
      body: "Only your free/busy status is ever shared. Your calendar details stay yours alone.",
    },
  ];

  const steps = [
    {
      title: "Create your account",
      body: "Sign up in under a minute — no credit card required.",
    },
    {
      title: "Connect your calendar",
      body: "Link Google Calendar with one click so Schedule Pro knows when you're free.",
    },
    {
      title: "Set your availability",
      body: "Choose the days and hours you're open for bookings.",
    },
    {
      title: "Share your link",
      body: "Send it via email, add it to your bio — wherever works for you.",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-[--bg-main] text-[--text-primary] transition-colors duration-300">
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 h-14 border-b border-[--divider-color]"
        style={{
          background: "var(--bg-main)",
          backdropFilter: "blur(12px)",
          opacity: 0.95,
        }}
      >
        <Link
          to={FrontendRoutes.HOME}
          className="flex items-center gap-2.5 group"
        >
          <Logo />
          <div className="leading-none">
            <span className="font-serif text-(--text-primary) text-[15px] tracking-tight block transition-colors">
              Schedule
            </span>
            <span className="font-serif italic text-(--accent-color) text-[11px] tracking-tight block -mt-0.5 transition-colors">
              Pro
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-[--text-secondary] hover:bg-[--divider-color] transition-all"
            title="Toggle theme"
          >
            {theme === "light" ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </button>
          <div className="w-px h-6 bg-[--divider-color] hidden sm:block" />
          <Link
            to={FrontendRoutes.LOGIN}
            className="text-[13px] text-[--text-secondary] hover:text-[--text-primary] transition-colors px-3 py-1.5 hidden sm:block"
          >
            Sign in
          </Link>
          <Link
            to={FrontendRoutes.SIGNUP}
            className="text-[13px] font-medium bg-[--text-primary] text-[--bg-main] px-4 py-1.5 rounded-lg hover:opacity-90 transition-all shadow-sm"
          >
            Get started
          </Link>
        </div>
      </nav>

      {/*  Hero */}
      <section className="relative pt-36 pb-28 px-6 md:px-12 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute top-20 left-1/2 -translate-x-1/2 w-159 h-150 rounded-full"
            style={{
              background:
                "radial-gradient(circle, var(--accent-color) 0%, transparent 70%)",
              opacity: 0.05,
            }}
          />
        </div>

        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(var(--accent-color) 1px, transparent 1px), linear-gradient(90deg, var(--accent-color) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div
            style={{
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? "translateY(0)" : "translateY(16px)",
              transition: "opacity 0.7s ease, transform 0.7s ease",
            }}
          >
            <span className="inline-flex items-center gap-2 bg-(--bg-card) border border-(--border-color) rounded-full px-4 py-1.5 text-[12px] text-(--accent-color) mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-(--accent-color) animate-pulse" />
              Scheduling, beautifully simplified
            </span>
          </div>

          <h1
            style={{
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? "translateY(0)" : "translateY(24px)",
              transition: "opacity 0.8s ease 0.1s, transform 0.8s ease 0.1s",
            }}
            className="font-serif text-(--text-primary) text-[44px] md:text-[64px] lg:text-[72px] leading-[1.08] tracking-tight mb-6"
          >
            Meetings that happen
            <br />
            <em className="text-(--accent-color)">on your terms.</em>
          </h1>

          {/* Subline */}
          <p
            style={{
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s",
            }}
            className="text-[16px] md:text-[18px] text-(--text-secondary) leading-relaxed max-w-2xl mx-auto mb-10"
          >
              Whether it&apos;s a quick check-in or a deep dive, choose the time that
              works for everyone.
            Schedule Pro syncs with Google Calendar so you&apos;re never
            double-booked.
          </p>

          <div
            style={{
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? "translateY(0)" : "translateY(16px)",
              transition: "opacity 0.8s ease 0.3s, transform 0.8s ease 0.3s",
            }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Link
              to={FrontendRoutes.SIGNUP}
              className="group flex items-center gap-2 bg-(--accent-color) text-(--nav-text) px-6 py-3 rounded-xl text-[14px] font-semibold hover:opacity-90 transition-all active:scale-[0.98] shadow-lg"
            >
              Start for free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              to={FrontendRoutes.LOGIN}
              className="flex items-center gap-2 bg-(--bg-card) border border-(--border-color) text-(--text-secondary) hover:text-(--text-primary) px-6 py-3 rounded-xl text-[14px] font-medium hover:border-(--accent-color)/30 transition-all"
            >
              Sign in
            </Link>
          </div>

          {/* Trust note */}
          <p
            style={{
              opacity: heroVisible ? 1 : 0,
              transition: "opacity 0.8s ease 0.5s",
            }}
            className="text-[12px] text-(--text-secondary)/60 mt-6"
          >
            No credit card required · Cancel anytime
          </p>
        </div>

        {/* Hero preview card */}
        <div
          style={{
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible
              ? "translateY(0) scale(1)"
              : "translateY(32px) scale(0.97)",
            transition: "opacity 1s ease 0.4s, transform 1s ease 0.4s",
          }}
          className="relative max-w-2xl mx-auto mt-16"
        >
          <div
            className="bg-(--bg-card) border border-(--border-color) rounded-2xl overflow-hidden shadow-2xl"
            style={{
              boxShadow:
                "0 40px 80px rgba(0,0,0,0.1), 0 0 0 1px var(--divider-color)",
            }}
          >
            {/* Card header */}
            <div className="px-6 py-4 border-b border-(--divider-color) flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-(--divider-color)" />
                <div className="w-3 h-3 rounded-full bg-(--divider-color)" />
                <div className="w-3 h-3 rounded-full bg-(--divider-color)" />
              </div>
              <div className="flex-1 bg-(--bg-main) border border-(--border-color) rounded-md px-3 py-1 text-[11px] text-(--text-secondary) font-mono">
                schedulepro.app/book/your-name
              </div>
            </div>
            {/* Card body */}
            <div className="p-6 grid grid-cols-2 gap-4 bg-(--bg-card)">
              <div>
                <p className="text-[12px] text-(--text-secondary) mb-3 uppercase tracking-wider">
                  Available this week
                </p>
                {["Mon, Mar 25", "Tue, Mar 26", "Thu, Mar 28"].map((day) => (
                  <div
                    key={day}
                    className="flex items-center justify-between bg-(--bg-main) border border-(--border-color) rounded-lg px-3 py-2 mb-2 group hover:border-(--accent-color)/20 transition-colors cursor-pointer"
                  >
                    <span className="text-[13px] text-(--text-primary)">
                      {day}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-(--text-secondary) group-hover:text-(--accent-color) transition-colors" />
                  </div>
                ))}
              </div>
              <div>
                <p className="text-[12px] text-(--text-secondary) mb-3 uppercase tracking-wider">
                  Pick a time
                </p>
                {["9:00 AM", "10:30 AM", "2:00 PM", "3:30 PM"].map(
                  (time, i) => (
                    <div
                      key={time}
                      className={`flex items-center justify-between rounded-lg px-3 py-2 mb-2 text-[13px] transition-colors cursor-pointer ${
                        i === 1
                          ? "bg-(--accent-color)/10 border border-(--accent-color)/30 text-(--accent-color)"
                          : "bg-(--bg-main) border border-(--border-color) text-(--text-primary) hover:border-(--accent-color)/20"
                      }`}
                    >
                      {time}
                      {i === 1 && <Check className="w-3.5 h-3.5" />}
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-(--divider-color) py-10 px-6 bg-(--bg-card)">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8">
          {[
            { value: 10000, suffix: "+", label: "Meetings scheduled" },
            { value: 98, suffix: "%", label: "On-time bookings" },
            { value: 2, suffix: " min", label: "Average setup time" },
          ].map(({ value, suffix, label }) => (
            <div key={label} className="text-center">
              <p className="font-serif text-(--text-primary) text-[32px] md:text-[40px] tracking-tight">
                <Counter target={value} suffix={suffix} />
              </p>
              <p className="text-[12px] text-(--text-secondary) uppercase tracking-widest mt-1">
                {label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[12px] text-(--accent-color) uppercase tracking-widest mb-3">
              Everything you need
            </p>
            <h2 className="font-serif text-(--text-primary) text-[32px] md:text-[40px] tracking-tight">
              Built for the way you work
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <FeatureCard key={f.title} {...f} delay={i * 80} />
            ))}
          </div>
        </div>
      </section>

      {/*  How it works */}
      <section className="py-24 px-6 md:px-12 border-t border-(--divider-color) bg-(--bg-main)">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-[12px] text-(--accent-color) uppercase tracking-widest mb-3">
              How it works
            </p>
            <h2 className="font-serif text-(--text-primary) text-[32px] md:text-[38px] tracking-tight mb-10 leading-tight">
              Up and running
              <br />
              in four steps.
            </h2>
            <div className="flex flex-col gap-7">
              {steps.map(({ title, body }, i) => (
                <Step
                  key={title}
                  num={i + 1}
                  title={title}
                  body={body}
                  delay={i * 100}
                />
              ))}
            </div>
          </div>

          <div className="bg-(--bg-card) border border-(--border-color) rounded-2xl p-6 shadow-xl hidden md:block">
            <div className="flex items-center justify-between mb-5">
              <span className="font-serif text-(--text-primary) text-[15px]">
                March 2026
              </span>
              <div className="flex gap-2">
                <div className="w-6 h-6 rounded bg-(--bg-main) border border-(--border-color) flex items-center justify-center cursor-pointer hover:bg-(--divider-color) transition-colors">
                  <span className="text-(--text-secondary) text-[10px]">‹</span>
                </div>
                <div className="w-6 h-6 rounded bg-(--bg-main) border border-(--border-color) flex items-center justify-center cursor-pointer hover:bg-(--divider-color) transition-colors">
                  <span className="text-(--text-secondary) text-[10px]">›</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                <div
                  key={d}
                  className="text-center text-[10px] text-(--text-secondary)/60 uppercase py-1"
                >
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {[
                "",
                "",
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                10,
                11,
                12,
                13,
                14,
                15,
                16,
                17,
                18,
                19,
                20,
                21,
                22,
                23,
                24,
                25,
                26,
                27,
                28,
                29,
                30,
                31,
                32,
                33,
              ]
                .slice(0, 35)
                .map((d, i) => (
                  <div
                    key={i}
                    className={`aspect-square flex items-center justify-center rounded-lg text-[12px] transition-colors ${
                      !d
                        ? ""
                        : d === 25
                          ? "bg-(--accent-color) text-(--bg-main) font-semibold"
                          : [18, 20, 27].includes(d)
                            ? "bg-(--accent-color)/10 text-(--accent-color) cursor-pointer"
                            : [16, 17, 23, 24, 30, 31].includes(d)
                              ? "text-(--divider-color)"
                              : "text-(--text-secondary) hover:bg-(--bg-main) cursor-pointer"
                    }`}
                  >
                    {d}
                  </div>
                ))}
            </div>
            <div className="mt-5 pt-4 border-t border-(--divider-color) space-y-2">
              {[
                {
                  time: "9:00 AM",
                  label: "Design review",
                  color:
                    "bg-(--accent-color)/10 border-(--accent-color)/20 text-(--accent-color)",
                },
                {
                  time: "2:30 PM",
                  label: "Client call",
                  color: "bg-blue-500/10 border-blue-500/20 text-blue-400",
                },
              ].map(({ time, label, color }) => (
                <div
                  key={label}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 border text-[12px] ${color}`}
                >
                  <span className="opacity-60 font-mono">{time}</span>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 md:px-12 bg-(--bg-main)">
        <div className="max-w-3xl mx-auto text-center bg-(--bg-card) border border-(--border-color) rounded-3xl px-8 py-16 relative overflow-hidden shadow-sm">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 50% 0%, var(--accent-color) 0%, transparent 65%)",
              opacity: 0.05,
            }}
          />
          <h2 className="font-serif text-(--text-primary) text-[32px] md:text-[42px] tracking-tight mb-4 relative">
            Ready to reclaim your calendar?
          </h2>
          <p className="text-[15px] text-(--text-secondary) mb-8 relative">
            Join thousands who&apos;ve stopped playing scheduling tag.
          </p>
          <Link
            to={FrontendRoutes.SIGNUP}
            className="inline-flex items-center gap-2 bg-(--text-primary) text-(--bg-main) px-8 py-3.5 rounded-xl text-[14px] font-semibold hover:opacity-90 transition-all active:scale-[0.98] shadow-lg relative"
          >
            Create your free account
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/*  Footer  */}
      <footer className="border-t border-(--divider-color) bg-(--bg-card) px-6 md:px-12 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2.5">
          <Logo />
          <div className="leading-none">
            <span className="font-serif text-(--text-primary) text-[15px] tracking-tight block transition-colors">
              Schedule
            </span>
            <span className="font-serif italic text-(--accent-color) text-[11px] tracking-tight block -mt-0.5 transition-colors">
              Pro
            </span>
          </div>
        </div>
        <p className="text-[12px] text-(--text-secondary)">
          © 2026 Schedule Pro. All rights reserved.
        </p>
        <div className="flex gap-6">
          {["Privacy", "Terms", "Contact"].map((l) => (
            <a
              key={l}
              href="#"
              className="text-[12px] text-(--text-secondary) hover:text-(--text-primary) transition-colors"
            >
              {l}
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
};

export default Home;
