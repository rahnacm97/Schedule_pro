import { useState, useEffect } from "react";
import api from "../utils/api";
import { Save } from "lucide-react";
import toast from "react-hot-toast";
import ApiRoutes from "../shared/constants/apiRoutes";

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const Availability = () => {
  const [availabilities, setAvailabilities] = useState(
    days.map((_, i) => ({
      dayOfWeek: i,
      startTime: "09:00",
      endTime: "17:00",
      isEnabled: i > 0 && i < 6,
    })),
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const { data } = await api.get(ApiRoutes.AVAILABILITY.BASE);
        if (data.length > 0) {
          const merged = days.map((_, i) => {
            const found = data.find((a) => a.dayOfWeek === i);
            return (
              found || {
                dayOfWeek: i,
                startTime: "09:00",
                endTime: "17:00",
                isEnabled: false,
              }
            );
          });
          setAvailabilities(merged);
        }
      } catch (err) {
        console.error("Error fetching availability:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAvailability();
  }, []);

  const handleToggle = (index) => {
    setAvailabilities((prev) =>
      prev.map((a, i) => (i === index ? { ...a, isEnabled: !a.isEnabled } : a)),
    );
  };

  const handleChange = (index, field, value) => {
    setAvailabilities((prev) =>
      prev.map((a, i) => (i === index ? { ...a, [field]: value } : a)),
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put(ApiRoutes.AVAILABILITY.BASE, { availabilities });
      toast.success("Availability updated successfully!");
    } catch {
      toast.error("Failed to update availability.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="font-serif text-(--text-secondary) text-lg italic transition-colors">
          Loading…
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto w-full">
      {/* Header */}
      <header className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-(--text-primary) text-[28px] md:text-[32px] tracking-tight leading-snug transition-colors">
            Set your availability
          </h1>
          <p className="text-[14px] text-(--text-secondary) font-light mt-1 transition-colors">
            Configure your weekly schedule for meetings.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[13px] font-medium transition-all active:scale-[0.98] disabled:opacity-50 whitespace-nowrap shadow-md ${
            saving
              ? "bg-emerald-600 text-white"
              : "bg-(--text-primary) text-(--bg-main) hover:opacity-90"
          }`}
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving…" : "Save changes"}
        </button>
      </header>

      {/* Day rows */}
      <div className="bg-(--bg-card) border border-(--border-color) rounded-2xl overflow-hidden divide-y divide-(--divider-color) shadow-sm transition-all">
        {availabilities.map((avail, i) => (
          <div
            key={i}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 py-4.5 gap-4 hover:bg-(--bg-main)/50 transition-colors"
          >
            {/* Left — toggle + day name */}
            <div className="flex items-center gap-4">
              <label className="relative inline-flex items-center cursor-pointer w-10 h-6 shrink-0">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={avail.isEnabled}
                  onChange={() => handleToggle(i)}
                />
                <div className="w-full h-full rounded-full bg-(--border-color) peer-checked:bg-(--nav-bg) transition-colors" />
                <div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform peer-checked:translate-x-4 shadow-sm" />
              </label>
              <span
                className={`text-[15px] w-24 transition-colors ${
                  avail.isEnabled
                    ? "text-(--text-primary) font-medium"
                    : "text-(--text-secondary) font-normal opacity-50"
                }`}
              >
                {days[i]}
              </span>
            </div>

            {/* Right — time range or unavailable */}
            {avail.isEnabled ? (
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <input
                  type="time"
                  value={avail.startTime}
                  onChange={(e) => handleChange(i, "startTime", e.target.value)}
                  className="flex-1 sm:flex-none px-3 py-2 border border-(--border-color) rounded-xl bg-(--bg-card) text-[13px] text-(--text-primary) outline-none focus:border-(--accent-color) focus:ring-4 focus:ring-(--accent-color)/10 transition-all"
                />
                <span className="text-[12px] text-(--text-secondary) font-light px-1">
                  to
                </span>
                <input
                  type="time"
                  value={avail.endTime}
                  onChange={(e) => handleChange(i, "endTime", e.target.value)}
                  className="flex-1 sm:flex-none px-3 py-2 border border-(--border-color) rounded-xl bg-(--bg-card) text-[13px] text-(--text-primary) outline-none focus:border-(--accent-color) focus:ring-4 focus:ring-(--accent-color)/10 transition-all"
                />
              </div>
            ) : (
              <span className="text-[13px] text-(--text-secondary) italic opacity-40 px-2 py-1">
                Unavailable
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Availability;
