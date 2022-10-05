const mongoose = require("mongoose");
const AppointmentSchema = new mongoose.Schema(
  {
    requestorId: { type: String, required: true, unique: true },
    ownerId: { type: String, required: true, unique: true },
    listingId: { type: String, required: true },
    date: { type: Date },
    confirmed: { type: Boolean },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", AppointmentSchema);
