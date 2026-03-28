import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import api from "../utils/api";
import { Clock, Link as LinkIcon, Users, Calendar, Check } from "lucide-react";
import FrontendRoutes from "../shared/constants/frontendRoutes";
import ApiRoutes from "../shared/constants/apiRoutes";

const Dashboard = () => {
  const { user } = useAuth();
  const [connecting, setConnecting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [statsData, setStatsData] = useState({ upcomingCount: 0, totalCount: 0, thisWeekCount: 0 });
  const [statsLoading, setStatsLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(true);

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get(ApiRoutes.BOOKINGS.STATS);
        setStatsData(data);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setStatsLoading(false);
      }
    };

    const fetchAppointments = async () => {
      try {
        const { data } = await api.get(ApiRoutes.BOOKINGS.BASE + "?status=scheduled&upcoming=true&limit=3");
        setAppointments(data?.appointments || []);
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
      } finally {
        setAppointmentsLoading(false);
      }
    };

    fetchStats();
    fetchAppointments();
  }, []);

  const bookingUrl = `${window.location.origin}${FrontendRoutes.BOOKING_PAGE(user?.linkSuffix)}`;

  const handleConnectCalendar = async () => {
    setConnecting(true);
    try {
      const { data } = await api.get(ApiRoutes.CALENDAR.GOOGLE_AUTH);
      window.location.href = data.url;
    } catch (error) {
      console.error("Failed to get auth URL:", error);
      setConnecting(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(bookingUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const stats = [
    {
      icon: Clock,
      label: "Upcoming meetings",
      value: statsLoading ? "..." : statsData.upcomingCount,
      iconColor: "text-[var(--accent-color)]",
      bgColor: "bg-[var(--accent-color)]/10",
    },
    {
      icon: Users,
      label: "Total bookings",
      value: statsLoading ? "..." : statsData.totalCount,
      iconColor: "text-emerald-600",
      bgColor: "bg-emerald-500/10",
    },
    {
      icon: Calendar,
      label: "This week",
      value: statsLoading ? "..." : statsData.thisWeekCount,
      iconColor: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
  ];

  return (
    <div className="w-full">
      {/* Header */}
      <header className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-(--text-primary) text-[28px] md:text-[32px] tracking-tight leading-snug transition-colors">
            Welcome back, {user?.name?.split(" ")[0]}.
          </h1>
          <p className="text-[14px] text-(--text-secondary) font-light mt-1 transition-colors">
            Manage your schedule and appointments from one place.
          </p>
        </div>
        <button
          onClick={handleConnectCalendar}
          disabled={connecting}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-medium transition-all active:scale-[0.98] disabled:opacity-50 whitespace-nowrap shadow-sm border ${user?.googleTokens
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600"
              : "bg-(--bg-card) border-(--border-color) text-(--text-primary) hover:bg-(--bg-main)"
            }`}
        >
          <Calendar
            className={`w-4 h-4 ${user?.googleTokens ? "text-emerald-500" : "text-(--text-secondary)"}`}
          />
          {user?.googleTokens
            ? "Calendar Connected"
            : connecting
              ? "Connecting…"
              : "Connect Google Calendar"}
        </button>
      </header>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-(--bg-card) border border-(--border-color) rounded-2xl px-6 py-5 flex items-center gap-4 transition-all hover:shadow-md"
          >
            <div
              className={`${stat.bgColor} w-12 h-12 rounded-xl flex items-center justify-center shrink-0`}
            >
              <stat.icon className={`${stat.iconColor} w-5 h-5`} />
            </div>
            <div>
              <p className="text-[12px] text-(--text-secondary) uppercase tracking-wider mb-0.5">
                {stat.label}
              </p>
              <p className="text-[24px] font-semibold text-(--text-primary) leading-none transition-colors">
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Booking link section */}
      <section className="bg-(--bg-card) border border-(--border-color) rounded-2xl overflow-hidden transition-all shadow-sm">
        <div className="px-6 py-4 border-b border-(--divider-color) flex items-center justify-between transition-colors">
          <h2 className="font-serif text-[18px] text-(--text-primary)">
            Your booking link
          </h2>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-[13px] font-medium transition-colors"
            style={{ color: copied ? "#10b981" : "var(--accent-color)" }}
          >
            {copied ? (
              <><Check className="w-4 h-4" /> Copied</>
            ) : (
              <><LinkIcon className="w-4 h-4" /> Copy link</>
            )}
          </button>
        </div>
        <div className="m-6 bg-(--bg-main) border-2 border-dashed border-(--border-color) rounded-xl px-4 md:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-6 transition-colors">
          <div className="text-center md:text-left">
            <p className="text-[14px] text-(--text-primary) font-medium break-all transition-colors mb-1">
              {bookingUrl}
            </p>
            <p className="text-[12px] text-(--text-secondary) font-light transition-colors">
              Share this link to let others schedule time with you.
            </p>
          </div>
          <button
            onClick={handleCopy}
            className={`px-6 py-2 rounded-xl text-[13px] font-medium transition-all active:scale-95 shadow-sm whitespace-nowrap ${copied ? "bg-emerald-500 text-white" : "bg-(--text-primary) text-(--bg-main) hover:opacity-90"
              }`}
          >
            {copied ? "Copied!" : "Copy"}
          </button>

        </div>
      </section>

      {/* Recent Appointments */}
      <section className="mt-8 bg-(--bg-card) border border-(--border-color) rounded-2xl overflow-hidden transition-all shadow-sm">
        <div className="px-6 py-4 border-b border-(--divider-color) flex items-center justify-between transition-colors">
          <h2 className="font-serif text-[18px] text-(--text-primary)">
            Upcoming Appointments
          </h2>
          <div className="flex items-center gap-4">
            <span className="text-[12px] text-(--text-secondary) font-medium">
              {appointments?.length || 0} scheduled
            </span>
            <a 
              href={FrontendRoutes.APPOINTMENTS} 
              className="text-[12px] font-medium text-(--accent-color) hover:underline"
            >
              View all
            </a>
          </div>
        </div>
        <div className="p-6">
          {appointmentsLoading ? (
            <div className="flex flex-col items-center py-10 gap-3">
              <div className="w-6 h-6 rounded-full border-2 border-(--accent-color)/20 border-t-(--accent-color) animate-spin" />
              <p className="text-[13px] text-(--text-secondary) italic">Loading appointments...</p>
            </div>
          ) : appointments?.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-(--border-color) rounded-xl">
              <Calendar className="w-10 h-10 text-(--text-secondary)/20 mx-auto mb-3" />
              <p className="text-[14px] text-(--text-secondary) font-light">No upcoming appointments yet.</p>
              <p className="text-[12px] text-(--text-secondary)/60 mt-1">Share your link to get started!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {appointments.map((apt) => {
                const isGuest = apt.guestEmail === user?.email;
                const displayName = isGuest ? apt.userId?.name : apt.guestName;
                const displayEmail = isGuest ? apt.userId?.email : apt.guestEmail;

                return (
                  <div key={apt._id} className="flex items-center justify-between bg-(--bg-main) border border-(--border-color) rounded-xl p-4 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-(--accent-color)/10 flex items-center justify-center text-(--accent-color) font-bold text-[14px]">
                        {displayName?.charAt(0).toUpperCase() || "?"}
                      </div>
                      <div>
                        <p className="text-[14px] font-medium text-(--text-primary)">
                          {displayName} {isGuest && <span className="text-[10px] font-normal opacity-60 ml-1">(Host)</span>}
                        </p>
                        <p className="text-[12px] text-(--text-secondary) font-light">{displayEmail}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[13px] font-medium text-(--text-primary)">
                        {new Date(apt.startTime).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </p>
                      <p className="text-[11px] text-(--text-secondary) font-light">
                        {new Date(apt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
