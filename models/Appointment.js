import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    provider: { type: String, required: true, trim: true }, // e.g., "Dr. Sharma"
    date: { type: String, required: true },                 // "YYYY-MM-DD"
    time: { type: String, required: true }                  // "HH:mm"
  },
  { timestamps: true }
);

// Prevent double-booking same provider+date+time
appointmentSchema.index({ provider: 1, date: 1, time: 1 }, { unique: true });

export default mongoose.model("Appointment", appointmentSchema);
