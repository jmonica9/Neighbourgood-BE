const mongoose = require("mongoose");
const ReviewSchema = new mongoose.Schema(
  {
    requestorId: { type: String, required: true, unique: true },
    ownerId: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", ReviewSchema);
