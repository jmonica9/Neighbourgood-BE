const mongoose = require("mongoose");
const ReviewSchema = new mongoose.Schema(
  {
    listingId: { type: String },
    requestorId: { type: String },
    ownerId: { type: String },
    reviewText: { type: String },
    type: { type: String },
    postedBy: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", ReviewSchema);
