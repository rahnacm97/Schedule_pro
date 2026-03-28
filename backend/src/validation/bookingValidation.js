import Joi from "joi";
import { validate } from "./authValidation.js";

export const bookingSchema = Joi.object({
  guestEmail: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email",
    "any.required": "Your email is required",
  }),
  guestName: Joi.string().min(2).required().messages({
    "string.min": "Name must be at least 2 characters",
    "any.required": "Your name is required",
  }),
  startTime: Joi.string().isoDate().required().messages({
    "any.required": "Start time is required",
  }),
  endTime: Joi.string().isoDate().required().messages({
    "any.required": "End time is required",
  }),
  notes: Joi.string().max(500).optional().allow(""),
  guestTimeZone: Joi.string().optional(),
  duration: Joi.number().optional(),
});

export const validateBooking = validate(bookingSchema);
