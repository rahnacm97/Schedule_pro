import Availability from "../models/Availability.js";

export const findByUserId = async (userId) => {
  return Availability.find({ userId }).sort({ dayOfWeek: 1 });
};

export const upsert = async ({
  userId,
  dayOfWeek,
  startTime,
  endTime,
  isEnabled,
}) => {
  return Availability.findOneAndUpdate(
    { userId, dayOfWeek, startTime, endTime },
    { isEnabled },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );
};

export const deleteByUserId = async (userId) => {
  return Availability.deleteMany({ userId });
};
