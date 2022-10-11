const mongoose = require("mongoose");
const ListingSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    requestorIds: { type: Array },
    title: { type: String },
    type: { type: String, required: true },
    category: { type: String, required: true, default: "Others" },
    image: { type: String },
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
