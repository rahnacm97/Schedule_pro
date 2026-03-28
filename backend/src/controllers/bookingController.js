import * as bookingService from "../services/bookingService.js";
import HttpStatus from "../shared/enums/httpStatus.js";
import SuccessMessages from "../shared/enums/successMessages.js";
import ErrorMessages from "../shared/enums/errorMessages.js";

//Appoinment booking
export const bookAppointment = async (req, res) => {
  try {
    const { linkSuffix } = req.params;
    const appointment = await bookingService.bookAppointment({
      hostLinkSuffix: linkSuffix,
      ...req.body,
    });
    res.status(HttpStatus.CREATED).json({
      message: SuccessMessages.APPOINTMENT_BOOKED,
      data: appointment,
    });
  } catch (error) {
    const status =
      error.message === ErrorMessages.HOST_NOT_FOUND
        ? HttpStatus.NOT_FOUND
        : error.message === ErrorMessages.SLOT_UNAVAILABLE
          ? HttpStatus.CONFLICT
          : HttpStatus.INTERNAL_SERVER_ERROR;
    res.status(status).json({ message: error.message });
  }
};
//Fetch all appointments
export const getMyAppointments = async (req, res) => {
  try {
    const { status, upcoming, page, limit, search } = req.query;
    const result = await bookingService.getAppointments(
      req.userId,
      req.userEmail,
      {
        status,
        upcoming: upcoming === "true",
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
        search,
      },
    );
    res.status(HttpStatus.OK).json(result);
  } catch (error) {
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};
//Update status
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await bookingService.updateStatus(
      req.params.id,
      req.userId,
      status,
    );
    res.status(HttpStatus.OK).json({
      message: SuccessMessages.PROFILE_UPDATED,
      data: appointment,
    });
  } catch (error) {
    const status =
      error.message === "Unauthorized"
        ? HttpStatus.FORBIDDEN
        : error.message === "Appointment not found"
          ? HttpStatus.NOT_FOUND
          : HttpStatus.INTERNAL_SERVER_ERROR;
    res.status(status).json({ message: error.message });
  }
};
//Cancel appointments
export const cancelAppointment = async (req, res) => {
  try {
    await bookingService.cancelAppointment(req.params.id, req.userId);
    res
      .status(HttpStatus.OK)
      .json({ message: SuccessMessages.APPOINTMENT_CANCELLED });
  } catch (error) {
    const status =
      error.message === ErrorMessages.UNAUTHORIZED
        ? HttpStatus.FORBIDDEN
        : error.message === ErrorMessages.APPOINTMENT_NOT_FOUND
          ? HttpStatus.NOT_FOUND
          : HttpStatus.INTERNAL_SERVER_ERROR;
    res.status(status).json({ message: error.message });
  }
};
//Get status
export const getBookingStats = async (req, res) => {
  try {
    const stats = await bookingService.getBookingStats(
      req.userId,
      req.userEmail,
    );
    res.status(HttpStatus.OK).json(stats);
  } catch (error) {
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};
