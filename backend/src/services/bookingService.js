import * as appointmentRepository from "../repositories/appointmentRepository.js";

import * as calendarService from "./calendarService.js";
import User from "../models/User.js";

// Appoinment booking
export const bookAppointment = async ({
  hostLinkSuffix,
  guestEmail,
  guestName,
  startTime,
  endTime,
  notes,
  guestTimeZone,
}) => {
  const host = await User.findOne({ linkSuffix: hostLinkSuffix }).select(
    "+googleTokens",
  );
  if (!host) throw new Error("Host not found");

  // Check for scheduling conflicts
  const conflicts = await appointmentRepository.getConflicts(
    host._id,
    startTime,
    endTime,
  );
  if (conflicts.length > 0)
    throw new Error("This time slot is no longer available");

  const appointmentData = {
    userId: host._id,
    guestEmail,
    guestName,
    startTime: new Date(startTime),
    endTime: new Date(endTime),
    notes,
    guestTimeZone,
  };

  const appointment = await appointmentRepository.create(appointmentData);

  // Sync with Google Calendar
  if (host.googleTokens) {
    const googleEventId = await calendarService.createCalendarEvent(
      host.googleTokens,
      appointment,
    );
    if (googleEventId) {
      await appointmentRepository.update(appointment._id, { googleEventId });
    }
  }

  return appointment;
};
//Get appointments
export const getAppointments = async (userId, email, options) => {
  return appointmentRepository.findByUserId(userId, email, options);
};
// Update status
export const updateStatus = async (appointmentId, userId, status) => {
  const appointment = await appointmentRepository.findById(appointmentId);
  if (!appointment) throw new Error("Appointment not found");

  const user = await User.findById(userId);
  const isHost = appointment.userId.toString() === userId.toString();
  const isGuest = appointment.guestEmail === user.email;

  if (!isHost && !isGuest) throw new Error("Unauthorized");

  return appointmentRepository.update(appointmentId, { status });
};
//Appointment cancellation
export const cancelAppointment = async (appointmentId, userId) => {
  const appointment = await appointmentRepository.findById(appointmentId);
  if (!appointment) throw new Error("Appointment not found");
  if (appointment.userId.toString() !== userId.toString())
    throw new Error("Unauthorized");

  const updated = await appointmentRepository.updateStatus(
    appointmentId,
    "cancelled",
  );

  if (updated.googleEventId) {
    const host = await User.findById(userId).select("+googleTokens");
    if (host && host.googleTokens) {
      await calendarService.deleteCalendarEvent(
        host.googleTokens,
        updated.googleEventId,
      );
    }
  }

  return updated;
};
//Fetch booking status
export const getBookingStats = async (userId, email) => {
  return appointmentRepository.getStats(userId, email);
};
