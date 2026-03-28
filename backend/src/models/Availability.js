import mongoose from "mongoose";

//Availabilty
const availabilitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    dayOfWeek: {
      type: Number,
      required: true,
      min: 0,
      max: 6,
      comment: "0 = Sunday, 6 = Saturday",
    },
    startTime: {
      type: String,
      required: true,
      match: [/^\d{2}:\d{2}$/, "Start time must be in HH:MM format"],
    },
    endTime: {
      type: String,
      required: true,
      match: [/^\d{2}:\d{2}$/, "End time must be in HH:MM format"],
    },
    isEnabled: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);
availabilitySchema.index(
  { userId: 1, dayOfWeek: 1, startTime: 1, endTime: 1 },
  { unique: true },
);

const Availability = mongoose.model("Availability", availabilitySchema);
export default Availability;
