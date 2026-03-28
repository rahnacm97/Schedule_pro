import express from "express";
import {
  bookAppointment,
  getMyAppointments,
  cancelAppointment,
  getBookingStats,
  updateAppointmentStatus,
} from "../controllers/bookingController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { validateBooking } from "../validation/bookingValidation.js";

const router = express.Router();
//Booking routes
router.post("/:linkSuffix", validateBooking, bookAppointment);
router.get("/stats", authenticateToken, getBookingStats);
router.get("/", authenticateToken, getMyAppointments);
router.patch("/:id/status", authenticateToken, updateAppointmentStatus);
router.patch("/:id/cancel", authenticateToken, cancelAppointment);

export default router;
