const mongoose = require("mongoose");
const ReviewSchema = new mongoose.Schema(
  {
    requestorId: { type: String, required: true },
    ownerId: { type: String, required: true },
    reviewText: { type: String },
    type: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", ReviewSchema);
