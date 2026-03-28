import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Clock,
  ChevronLeft,
  CheckCircle2,
  Calendar,
  ArrowRight,
} from "lucide-react";
import ApiRoutes from "../shared/constants/apiRoutes";
import Logo from "../components/Logo";
import toast from "react-hot-toast";

const schema = z.object({
  guestName: z.string().min(2, "Name must be at least 2 characters"),
  guestEmail: z.string().email("Please enter a valid email"),
  notes: z.string().max(500).optional(),
  guestTimeZone: z.string().optional(),
  duration: z.number().min(5, "Minimum 5 minutes"),
});

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const generateSlots = (availabilities, date, duration = 30) => {
  const dayOfWeek = date.getDay();
  const avail = availabilities.find(
    (a) => a.dayOfWeek === dayOfWeek && a.isEnabled,
  );
  if (!avail) return [];
  const slots = [];
  const [startH, startM] = avail.startTime.split(":").map(Number);
  const [endH, endM] = avail.endTime.split(":").map(Number);
  let current = new Date(date);
  current.setHours(startH, startM, 0, 0);
  const end = new Date(date);
  end.setHours(endH, endM, 0, 0);
  while (current < end) {
    slots.push(new Date(current));
    current = new Date(current.getTime() + duration * 60 * 1000);
  }
  return slots;
};

const Field = ({ label, error, children }) => (
  <div>
    <label className="block text-[11px] font-medium uppercase tracking-widest text-(--text-secondary) mb-1.5 transition-colors">
      {label}
    </label>
    {children}
    {error && <p className="text-[11px] text-red-600 mt-1">{error}</p>}
  </div>
);

const BookingPage = () => {
  const { linkSuffix } = useParams();
  const [host, setHost] = useState(null);
  const [availabilities, setAvailabilities] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [step, setStep] = useState("duration");
  const [loading, setLoading] = useState(true);
  const [slots, setSlots] = useState([]);
  const [selectedDuration, setSelectedDuration] = useState(30);
  const [customDuration, setCustomDuration] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { duration: 30 },
  });

  useEffect(() => {
    (async () => {
      try {
        const { data: hostData } = await api.get(
          ApiRoutes.AUTH.PUBLIC_PROFILE(linkSuffix),
        );
        const { data: availData } = await api.get(
          ApiRoutes.AVAILABILITY.PUBLIC(linkSuffix),
        );
        setHost(hostData);
        setAvailabilities(availData);
        setSelectedDuration(hostData.bookingDuration || 30);
        setValue("duration", hostData.bookingDuration || 30);
      } catch {
        setHost(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [linkSuffix, setValue]);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    setSlots(generateSlots(availabilities, date, selectedDuration));
  };

  const handleDurationChange = (d) => {
    setSelectedDuration(d);
    setValue("duration", d);
    if (selectedDate) {
      setSlots(generateSlots(availabilities, selectedDate, d));
    }
  };

  const onSubmit = async (data) => {
    try {
      const startTime = selectedSlot.toISOString();
      const endTime = new Date(
        selectedSlot.getTime() + selectedDuration * 60 * 1000,
      ).toISOString();
      await api.post(ApiRoutes.BOOKINGS.PUBLIC(linkSuffix), {
        ...data,
        startTime,
        endTime,
        guestTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
      setStep("success");
    } catch (error) {
      if (error.response?.status === 409) {
        toast.error(
          "This slot has already been booked. Please select another time.",
        );
      } else {
        toast.error(
          error.response?.data?.message ||
            "Failed to book appointment. Please try again.",
        );
      }
    }
  };

  const availableDays = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return d;
  }).filter((d) =>
    availabilities.some((a) => a.dayOfWeek === d.getDay() && a.isEnabled),
  );

  /* ── Loading ── */
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-(--bg-main) transition-colors duration-300">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 rounded-full border-2 border-(--accent-color)/20 border-t-(--accent-color) animate-spin" />
          <p className="font-serif italic text-(--text-secondary) text-sm tracking-tight transition-colors">
            Loading…
          </p>
        </div>
      </div>
    );

  if (!host)
    return (
      <div className="min-h-screen flex items-center justify-center bg-(--bg-main) transition-colors duration-300">
        <div className="text-center">
          <p className="font-serif text-(--text-primary) text-[28px] mb-2 transition-colors">
            Page not found
          </p>
          <p className="text-[14px] text-(--text-secondary) transition-colors">
            This scheduling link doesn&apos;t exist.
          </p>
        </div>
      </div>
    );

  const initials = host.name
    ?.split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-(--bg-main) transition-colors duration-300">
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.03] dark:opacity-[0.015] transition-opacity duration-300"
        style={{
          backgroundImage:
            "linear-gradient(var(--accent-color) 1px,transparent 1px),linear-gradient(90deg,var(--accent-color) 1px,transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative w-full max-w-3xl">
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <Logo size={24} />
          <div className="leading-none">
            <span className="font-serif text-(--text-primary) text-[15px] tracking-tight block transition-colors">
              Schedule
            </span>
            <span className="font-serif italic text-(--accent-color) text-[11px] tracking-tight block -mt-0.5 transition-colors">
              Pro
            </span>
          </div>
        </div>

        <div className="bg-(--bg-card) border border-(--border-color) rounded-3xl overflow-hidden shadow-2xl transition-all duration-300">
          <div className="grid md:grid-cols-5">
            {/*  Left sidebar  */}
            <div className="md:col-span-2 border-b md:border-b-0 md:border-r border-(--divider-color) p-9 flex flex-col gap-8 transition-colors">
              {/* Avatar */}
              <div className="w-16 h-16 rounded-2xl bg-(--accent-color)/10 border border-(--accent-color)/20 flex items-center justify-center transition-colors">
                <span className="font-serif text-(--accent-color) text-[24px] transition-colors">
                  {initials}
                </span>
              </div>

              <div>
                <h1 className="font-serif text-(--text-primary) text-[24px] tracking-tight leading-tight transition-colors">
                  {host.name}
                </h1>
                <p className="text-[14px] text-(--text-secondary) mt-1 font-light transition-colors">
                  {host.bookingTitle || "30 Minute Meeting"}
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 text-[14px] text-(--text-secondary) transition-colors">
                  <Clock className="w-4.5 h-4.5 text-(--accent-color)/70 shrink-0" />
                  <span>{selectedDuration} minutes</span>
                </div>

                {selectedDate && (
                  <div
                    className="flex items-center gap-3 text-[14px] text-(--text-primary) transition-colors"
                    style={{ animation: "fadeIn 0.3s ease" }}
                  >
                    <Calendar className="w-4.5 h-4.5 text-(--accent-color)/70 shrink-0" />
                    <span className="font-medium">
                      {DAYS[selectedDate.getDay()]},{" "}
                      {MONTHS[selectedDate.getMonth()]} {selectedDate.getDate()}
                    </span>
                  </div>
                )}

                {selectedSlot && (
                  <div
                    className="flex items-center gap-3 text-[14px] text-(--accent-color) transition-colors"
                    style={{ animation: "fadeIn 0.3s ease" }}
                  >
                    <Clock className="w-4.5 h-4.5 shrink-0" />
                    <span className="font-semibold uppercase tracking-wide">
                      {selectedSlot.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                )}
              </div>

              {/* Step indicators */}
              <div className="mt-auto flex gap-2.5 pt-6">
                {["duration", "calendar", "form"].map((s, i) => (
                  <div key={s} className="flex items-center gap-2.5">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] border transition-all duration-300 ${
                        step === s
                          ? "bg-(--text-primary) border-(--text-primary) text-(--bg-main) font-bold"
                          : step === "success" ||
                              (s === "calendar" && step === "form") ||
                              (s === "duration" &&
                                (step === "calendar" || step === "form"))
                            ? "bg-(--accent-color)/10 border-(--accent-color)/30 text-(--accent-color)"
                            : "border-(--border-color) text-(--text-secondary)"
                      }`}
                    >
                      {i + 1}
                    </div>
                    {i < 2 && <div className="w-6 h-px bg-(--divider-color)" />}
                  </div>
                ))}
              </div>
            </div>

            <div className="md:col-span-3 p-9 transition-colors">
              {step === "success" && (
                <div
                  className="h-full flex flex-col items-center justify-center text-center py-8 gap-4"
                  style={{ animation: "fadeIn 0.5s ease" }}
                >
                  <div className="w-18 h-18 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-2">
                    <CheckCircle2 className="w-9 h-9 text-emerald-500" />
                  </div>
                  <div>
                    <h2 className="font-serif text-(--text-primary) text-[28px] tracking-tight mb-2 transition-colors">
                      You&apos;re all set.
                    </h2>
                    <p className="text-[15px] text-(--text-secondary) leading-relaxed font-light transition-colors">
                      A confirmation has been sent to your email.
                      <br />
                      We look forward to speaking with you.
                    </p>
                  </div>
                  <div className="mt-4 bg-(--bg-main) border border-(--border-color) rounded-2xl px-7 py-4 text-[14px] text-(--text-secondary) text-center shadow-sm transition-colors">
                    <span className="text-(--text-primary) font-medium">
                      {selectedDate &&
                        `${DAYS[selectedDate.getDay()]}, ${MONTHS[selectedDate.getMonth()]}`}
                    </span>
                    {selectedSlot && (
                      <span className="opacity-80">
                        {" "}
                        at{" "}
                        {selectedSlot.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* FORM */}
              {step === "form" && (
                <div style={{ animation: "fadeIn 0.3s ease" }}>
                  <button
                    onClick={() => setStep("calendar")}
                    className="flex items-center gap-1.5 text-[14px] text-(--text-secondary) hover:text-(--text-primary) transition-colors mb-8 font-medium"
                  >
                    <ChevronLeft className="w-4 h-4" /> Back to calendar
                  </button>
                  <h2 className="font-serif text-(--text-primary) text-[24px] tracking-tight mb-7 transition-colors">
                    Finalize your booking
                  </h2>

                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-5"
                  >
                    <Field label="Full name" error={errors.guestName?.message}>
                      <input
                        {...register("guestName")}
                        placeholder="Jane Smith"
                        className="w-full bg-(--bg-card) border border-(--border-color) rounded-xl px-4 py-3 text-[14px] text-(--text-primary) placeholder-(--text-secondary)/40 outline-none focus:border-(--accent-color)/60 focus:ring-4 focus:ring-(--accent-color)/10 transition-all"
                      />
                    </Field>
                    <Field
                      label="Email address"
                      error={errors.guestEmail?.message}
                    >
                      <input
                        {...register("guestEmail")}
                        placeholder="jane@example.com"
                        className="w-full bg-(--bg-card) border border-(--border-color) rounded-xl px-4 py-3 text-[14px] text-(--text-primary) placeholder-(--text-secondary)/40 outline-none focus:border-(--accent-color)/60 focus:ring-4 focus:ring-(--accent-color)/10 transition-all"
                      />
                    </Field>
                    <Field
                      label="Notes (optional)"
                      error={errors.notes?.message}
                    >
                      <textarea
                        {...register("notes")}
                        rows={3}
                        placeholder="Anything you'd like to share before the meeting…"
                        className="w-full bg-(--bg-card) border border-(--border-color) rounded-xl px-4 py-3 text-[14px] text-(--text-primary) placeholder-(--text-secondary)/40 outline-none focus:border-(--accent-color)/60 focus:ring-4 focus:ring-(--accent-color)/10 transition-all resize-none"
                      />
                    </Field>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="mt-2 w-full flex items-center justify-center gap-2 bg-(--text-primary) text-(--bg-main) py-3.5 rounded-xl text-[14px] font-semibold hover:opacity-90 disabled:opacity-50 transition-all active:scale-[0.98] shadow-lg shadow-(--text-primary)/10"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 rounded-full border-2 border-(--bg-main)/20 border-t-(--bg-main) animate-spin" />{" "}
                          Booking…
                        </>
                      ) : (
                        <>
                          {" "}
                          Confirm appointment <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}

              {/* DURATION */}
              {step === "duration" && (
                <div style={{ animation: "fadeIn 0.3s ease" }}>
                  <h2 className="font-serif text-(--text-primary) text-[24px] tracking-tight mb-8 transition-colors">
                    How long do you need?
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    {[30, 60].map((d) => (
                      <button
                        key={d}
                        onClick={() => handleDurationChange(d)}
                        className={`flex flex-col items-center py-6 rounded-2xl border transition-all duration-300 ${
                          selectedDuration === d && customDuration === ""
                            ? "border-(--accent-color)/50 bg-(--accent-color)/10 text-(--accent-color) shadow-sm"
                            : "border-(--border-color) bg-(--bg-card) text-(--text-secondary) hover:border-(--accent-color)/30 hover:text-(--text-primary)"
                        }`}
                      >
                        <Clock className="w-6 h-6 mb-2 opacity-60" />
                        <span className="text-[18px] font-serif">{d} min</span>
                      </button>
                    ))}
                    <div
                      className={`flex flex-col items-center py-6 rounded-2xl border transition-all duration-300 ${
                        customDuration !== ""
                          ? "border-(--accent-color)/50 bg-(--accent-color)/10 text-(--accent-color) shadow-sm"
                          : "border-(--border-color) bg-(--bg-card) text-(--text-secondary)"
                      }`}
                    >
                      <span className="text-[11px] uppercase font-bold tracking-widest opacity-60 mb-2">
                        Custom
                      </span>
                      <input
                        type="number"
                        placeholder="Min"
                        value={customDuration}
                        onChange={(e) => {
                          setCustomDuration(e.target.value);
                          if (e.target.value)
                            handleDurationChange(parseInt(e.target.value));
                        }}
                        className="w-20 bg-transparent border-b border-(--border-color) text-center text-[18px] font-serif outline-none focus:border-(--accent-color)"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => setStep("calendar")}
                    className="w-full flex items-center justify-center gap-2 bg-(--text-primary) text-(--bg-main) py-3.5 rounded-xl text-[14px] font-semibold hover:opacity-90 transition-all shadow-lg"
                  >
                    Next: Choose time <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* CALENDAR */}
              {step === "calendar" && (
                <div style={{ animation: "fadeIn 0.3s ease" }}>
                  <button
                    onClick={() => setStep("duration")}
                    className="flex items-center gap-1.5 text-[14px] text-(--text-secondary) hover:text-(--text-primary) transition-colors mb-7 font-medium"
                  >
                    <ChevronLeft className="w-4 h-4" /> Change duration
                  </button>
                  <h2 className="font-serif text-(--text-primary) text-[24px] tracking-tight mb-8 transition-colors">
                    Select a time that works for you. We&apos;ll handle the rest.
                  </h2>

                  {availableDays.length === 0 ? (
                    <div className="text-center py-16 text-[15px] text-(--text-secondary) italic opacity-60">
                      You haven&apos;t set up your availability yet. slots for the next 14 days.
                    </div>
                  ) : (
                    <>
                      {/* Date grid */}
                      <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 mb-6">
                        {availableDays.map((d, i) => {
                          const isSelected =
                            selectedDate?.toDateString() === d.toDateString();
                          return (
                            <button
                              key={i}
                              onClick={() => handleDateSelect(d)}
                              className={`flex flex-col items-center py-3.5 rounded-2xl border transition-all duration-300 ${
                                isSelected
                                  ? "border-(--accent-color)/50 bg-(--accent-color)/10 text-(--accent-color) shadow-sm"
                                  : "border-(--border-color) bg-(--bg-card) text-(--text-secondary) hover:border-(--accent-color)/30 hover:text-(--text-primary)"
                              }`}
                            >
                              <span className="text-[10px] uppercase font-bold tracking-widest opacity-60 mb-1">
                                {DAYS[d.getDay()].slice(0, 3)}
                              </span>
                              <span
                                className={`text-[20px] font-serif leading-none ${isSelected ? "text-(--accent-color)" : ""}`}
                              >
                                {d.getDate()}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Time slots */}
                      {selectedDate && (
                        <div style={{ animation: "fadeIn 0.3s ease" }}>
                          <p className="text-[11px] text-(--text-secondary) uppercase font-bold tracking-[0.15em] mb-4">
                            Available times
                          </p>
                          <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1 custom-scroll">
                            {slots.map((slot, i) => {
                              const isSelected =
                                selectedSlot?.getTime() === slot.getTime();
                              return (
                                <button
                                  key={i}
                                  onClick={() => setSelectedSlot(slot)}
                                  className={`py-3 rounded-xl border text-[14px] transition-all duration-300 ${
                                    isSelected
                                      ? "bg-(--accent-color)/10 border-(--accent-color)/40 text-(--accent-color) font-bold"
                                      : "border-(--border-color) bg-(--bg-main)/30 text-(--text-secondary) hover:border-(--accent-color)/30 hover:text-(--text-primary)"
                                  }`}
                                >
                                  {slot.toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </button>
                              );
                            })}
                          </div>

                          {selectedSlot && (
                            <button
                              onClick={() => setStep("form")}
                              className="mt-6 w-full flex items-center justify-center gap-2 bg-(--text-primary) text-(--bg-main) py-3.5 rounded-xl text-[14px] font-semibold hover:opacity-90 transition-all active:scale-[0.98] shadow-lg shadow-(--text-primary)/10"
                              style={{ animation: "fadeIn 0.4s ease forwards" }}
                            >
                              Continue <ArrowRight className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .custom-scroll::-webkit-scrollbar { width: 4px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: var(--divider-color); border-radius: 99px; }
      `}</style>
    </div>
  );
};

export default BookingPage;
