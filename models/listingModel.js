const mongoose = require("mongoose");
const ListingSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    requestorIds: { type: Array },
    type: { type: String, required: true },
    category: { type: String, required: true, default: "Others" },
    reserved: { type: Boolean },
    reservedBy: { type: Array },
    dateOfTransaction: { type: Date },
    location: { type: String },
    depositAmount: { type: Number },
    chats: { type: Array },
    completed: { type: Boolean },
    like: { type: Number },
    comment: { type: Array },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Listing", ListingSchema);
