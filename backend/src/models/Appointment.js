import mongoose from "mongoose";

//Appointment
const appointmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    guestEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    guestName: {
      type: String,
      required: true,
      trim: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["scheduled", "cancelled", "completed"],
      default: "scheduled",
    },
    notes: {
      type: String,
      default: null,
      maxlength: 500,
    },
    googleEventId: {
      type: String,
      default: null,
    },
    guestTimeZone: {
      type: String,
      default: "UTC",
    },
  },
  {
    timestamps: true,
  },
);

appointmentSchema.index({ userId: 1, startTime: 1 });
appointmentSchema.index({ userId: 1, status: 1 });

const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;
