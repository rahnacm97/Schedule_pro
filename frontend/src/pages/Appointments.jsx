import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../hooks/useAuth";
import api from "../utils/api";
import {
  Calendar,
  Search,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock,
  XCircle,
  Filter,
  Eye,
  X,
} from "lucide-react";
import ApiRoutes from "../shared/constants/apiRoutes";
import toast from "react-hot-toast";

const Appointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const limit = 5;

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get(ApiRoutes.BOOKINGS.BASE, {
        params: { status, page, limit, search },
      });
      setAppointments(data?.appointments || []);
      setTotal(data?.total || 0);
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  }, [status, page, limit, search]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await api.patch(`${ApiRoutes.BOOKINGS.BASE}/${id}/status`, {
        status: newStatus,
      });
      toast.success(`Appointment marked as ${newStatus}`);
      fetchAppointments();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="w-full max-w-6xl mx-auto">
      <header className="mb-8">
        <h1 className="font-serif text-(--text-primary) text-[32px] tracking-tight leading-snug">
          Manage Appointments
        </h1>
        <p className="text-[14px] text-(--text-secondary) font-light mt-1">
          View and manage all your scheduled and past meetings.
        </p>
      </header>

      {/* Filters & Search */}
      <div className="bg-(--bg-card) border border-(--border-color) rounded-2xl p-4 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm transition-all">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-(--text-secondary)" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full bg-(--bg-main) border border-(--border-color) rounded-xl pl-10 pr-4 py-2 text-[14px] text-(--text-primary) focus:border-(--accent-color)/60 outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <Filter className="w-4 h-4 text-(--text-secondary) shrink-0" />
          {["all", "scheduled", "completed", "cancelled"].map((s) => (
            <button
              key={s}
              onClick={() => {
                setStatus(s);
                setPage(1);
              }}
              className={`px-4 py-1.5 rounded-full text-[12px] font-medium capitalize transition-all border whitespace-nowrap ${
                status === s
                  ? "bg-(--accent-color) border-(--accent-color) text-white shadow-sm"
                  : "bg-transparent border-(--border-color) text-(--text-secondary) hover:border-(--accent-color)/40"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-(--bg-card) border border-(--border-color) rounded-2xl overflow-hidden shadow-sm transition-all">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-(--divider-color) bg-(--bg-main)/50">
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-(--text-secondary)">
                  Participant
                </th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-(--text-secondary)">
                  Role
                </th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-(--text-secondary)">
                  Date & Time
                </th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-(--text-secondary)">
                  Status
                </th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-(--text-secondary) text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-(--divider-color)">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-6 h-6 rounded-full border-2 border-(--accent-color)/20 border-t-(--accent-color) animate-spin" />
                      <p className="text-[13px] text-(--text-secondary) italic">
                        Loading appointments...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : appointments.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-2 opacity-40">
                      <Calendar className="w-10 h-10 mb-2" />
                      <p className="text-[14px] font-medium">
                        No appointments found
                      </p>
                      <p className="text-[12px]">
                        Try adjusting your search or filters.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                appointments.map((apt) => {
                  const isGuest = apt.guestEmail === user?.email;
                  const displayName = isGuest
                    ? apt.userId?.name
                    : apt.guestName;
                  const displayEmail = isGuest
                    ? apt.userId?.email
                    : apt.guestEmail;

                  return (
                    <tr
                      key={apt._id}
                      className="hover:bg-(--bg-main)/30 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-(--accent-color)/10 flex items-center justify-center text-(--accent-color) font-bold text-[13px]">
                            {displayName?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-[14px] font-medium text-(--text-primary)">
                              {displayName}
                            </p>
                            <p className="text-[12px] text-(--text-secondary) font-light">
                              {displayEmail}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${isGuest ? "bg-blue-500/10 text-blue-500" : "bg-emerald-500/10 text-emerald-500"}`}
                        >
                          {isGuest ? "Guest" : "Host"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-[13px]">
                          <p className="text-(--text-primary) font-medium">
                            {new Date(apt.startTime).toLocaleDateString([], {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                          <p className="text-(--text-secondary) font-light">
                            {new Date(apt.startTime).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide ${
                            apt.status === "scheduled"
                              ? "text-blue-500"
                              : apt.status === "completed"
                                ? "text-emerald-500"
                                : "text-red-500"
                          }`}
                        >
                          {apt.status === "scheduled" && (
                            <Clock className="w-3 h-3" />
                          )}
                          {apt.status === "completed" && (
                            <CheckCircle2 className="w-3 h-3" />
                          )}
                          {apt.status === "cancelled" && (
                            <XCircle className="w-3 h-3" />
                          )}
                          {apt.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setSelectedAppointment(apt)}
                            className="p-2 rounded-lg bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {apt.status === "scheduled" && (
                            <>
                              <button
                                onClick={() =>
                                  handleUpdateStatus(apt._id, "completed")
                                }
                                className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 transition-colors"
                                title="Mark as Completed"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() =>
                                  handleUpdateStatus(apt._id, "cancelled")
                                }
                                className="p-2 rounded-lg bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-colors"
                                title="Cancel"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-(--divider-color) flex items-center justify-between bg-(--bg-main)/20">
            <p className="text-[13px] text-(--text-secondary)">
              Showing{" "}
              <span className="text-(--text-primary) font-medium">
                {appointments.length}
              </span>{" "}
              of{" "}
              <span className="text-(--text-primary) font-medium">{total}</span>{" "}
              results
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="p-2 rounded-lg border border-(--border-color) hover:bg-(--bg-card) disabled:opacity-30 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex items-center px-4 py-1.5 rounded-lg border border-(--border-color) bg-(--bg-card) text-[13px] font-medium min-w-12 justify-center">
                {page} / {totalPages}
              </div>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="p-2 rounded-lg border border-(--border-color) hover:bg-(--bg-card) disabled:opacity-30 transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* View Details Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-(--bg-card) border border-(--border-color) rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-(--divider-color)">
              <h2 className="font-serif text-[18px] text-(--text-primary)">
                Appointment Details
              </h2>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="p-1.5 rounded-lg text-(--text-secondary) hover:bg-(--bg-main) hover:text-(--text-primary) transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Participant Info */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-(--accent-color)/10 flex items-center justify-center text-(--accent-color) font-bold text-[18px]">
                  {(selectedAppointment.guestEmail === user?.email
                    ? selectedAppointment.userId?.name
                    : selectedAppointment.guestName
                  )
                    ?.charAt(0)
                    .toUpperCase()}
                </div>
                <div>
                  <p className="text-[16px] font-medium text-(--text-primary)">
                    {selectedAppointment.guestEmail === user?.email
                      ? selectedAppointment.userId?.name
                      : selectedAppointment.guestName}
                    <span
                      className={`ml-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${selectedAppointment.guestEmail === user?.email ? "bg-blue-500/10 text-blue-500" : "bg-emerald-500/10 text-emerald-500"}`}
                    >
                      {selectedAppointment.guestEmail === user?.email
                        ? "Guest"
                        : "Host"}
                    </span>
                  </p>
                  <p className="text-[13px] text-(--text-secondary) font-light">
                    {selectedAppointment.guestEmail === user?.email
                      ? selectedAppointment.userId?.email
                      : selectedAppointment.guestEmail}
                  </p>
                </div>
              </div>

              {/* Grid Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-(--bg-main) p-4 rounded-xl border border-(--border-color)">
                  <p className="text-[11px] uppercase tracking-wider text-(--text-secondary) font-medium mb-1">
                    Date
                  </p>
                  <p className="text-[14px] text-(--text-primary) font-medium">
                    {new Date(selectedAppointment.startTime).toLocaleDateString(
                      [],
                      {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      },
                    )}
                  </p>
                </div>
                <div className="bg-(--bg-main) p-4 rounded-xl border border-(--border-color)">
                  <p className="text-[11px] uppercase tracking-wider text-(--text-secondary) font-medium mb-1">
                    Time
                  </p>
                  <p className="text-[14px] text-(--text-primary) font-medium">
                    {new Date(selectedAppointment.startTime).toLocaleTimeString(
                      [],
                      { hour: "2-digit", minute: "2-digit" },
                    )}
                  </p>
                </div>
                <div className="bg-(--bg-main) p-4 rounded-xl border border-(--border-color)">
                  <p className="text-[11px] uppercase tracking-wider text-(--text-secondary) font-medium mb-1">
                    Duration
                  </p>
                  <p className="text-[14px] text-(--text-primary) font-medium">
                    {selectedAppointment.duration
                      ? `${selectedAppointment.duration} minutes`
                      : "30 minutes"}
                  </p>
                </div>
                <div className="bg-(--bg-main) p-4 rounded-xl border border-(--border-color)">
                  <p className="text-[11px] uppercase tracking-wider text-(--text-secondary) font-medium mb-1">
                    Status
                  </p>
                  <p
                    className={`text-[14px] font-medium capitalize ${
                      selectedAppointment.status === "scheduled"
                        ? "text-blue-500"
                        : selectedAppointment.status === "completed"
                          ? "text-emerald-500"
                          : "text-red-500"
                    }`}
                  >
                    {selectedAppointment.status}
                  </p>
                </div>
              </div>

              {/* Notes */}
              <div>
                <p className="text-[11px] uppercase tracking-wider text-(--text-secondary) font-medium mb-2">
                  Notes & Context
                </p>
                <div className="bg-(--bg-main) p-4 rounded-xl border border-(--border-color) min-h-20">
                  {selectedAppointment.notes ? (
                    <p className="text-[13px] text-(--text-primary) whitespace-pre-wrap leading-relaxed">
                      {selectedAppointment.notes}
                    </p>
                  ) : (
                    <p className="text-[13px] text-(--text-secondary) italic">
                      No notes provided for this meeting.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="px-6 py-4 border-t border-(--divider-color) flex justify-end">
              <button
                onClick={() => setSelectedAppointment(null)}
                className="px-5 py-2 rounded-xl text-[13px] font-medium bg-(--text-primary) text-(--bg-main) hover:opacity-90 transition-all active:scale-95"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
