import Appointment from "../models/Appointment.js";

export const create = async ({
  userId,
  guestEmail,
  guestName,
  startTime,
  endTime,
  notes,
  guestTimeZone,
}) => {
  const appointment = new Appointment({
    userId,
    guestEmail,
    guestName,
    startTime,
    endTime,
    notes,
    guestTimeZone,
  });
  return appointment.save();
};

export const findById = async (id) => {
  return Appointment.findById(id);
};

export const findByUserId = async (userId, email, options = {}) => {
  const { status, upcoming, page = 1, limit = 10, search } = options;
  const skip = (page - 1) * limit;

  const filter = {
    $or: [{ userId }, { guestEmail: email }],
  };

  if (status && status !== "all") filter.status = status;
  if (upcoming) filter.startTime = { $gte: new Date() };

  if (search) {
    filter.$or = filter.$or.map((cond) => ({
      ...cond,
      $or: [
        { guestName: { $regex: search, $options: "i" } },
        { guestEmail: { $regex: search, $options: "i" } },
      ],
    }));
  }

  const sortDirection = upcoming ? 1 : -1;

  const query = Appointment.find(filter)
    .populate("userId", "name email")
    .sort({ startTime: sortDirection })
    .skip(skip)
    .limit(limit);

  const [appointments, total] = await Promise.all([
    query,
    Appointment.countDocuments(filter),
  ]);

  return { appointments, total };
};

export const updateStatus = async (id, status) => {
  return Appointment.findByIdAndUpdate(id, { status }, { new: true });
};

export const updateGoogleEventId = async (id, googleEventId) => {
  return Appointment.findByIdAndUpdate(id, { googleEventId }, { new: true });
};

export const update = async (id, data) => {
  return Appointment.findByIdAndUpdate(id, data, { new: true });
};

export const getConflicts = async (userId, startTime, endTime) => {
  return Appointment.find({
    userId,
    status: "scheduled",
    startTime: { $lt: new Date(endTime) },
    endTime: { $gt: new Date(startTime) },
  });
};

export const getStats = async (userId, email) => {
  const now = new Date();

  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  const [totalCount, upcomingCount, thisWeekCount] = await Promise.all([
    Appointment.countDocuments({
      $or: [{ userId }, { guestEmail: email }],
      status: "scheduled",
    }),
    Appointment.countDocuments({
      $or: [{ userId }, { guestEmail: email }],
      status: "scheduled",
      startTime: { $gte: now },
    }),
    Appointment.countDocuments({
      $or: [{ userId }, { guestEmail: email }],
      status: "scheduled",
      startTime: { $gte: startOfWeek, $lte: endOfWeek },
    }),
  ]);

  return { totalCount, upcomingCount, thisWeekCount };
};
