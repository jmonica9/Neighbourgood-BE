const mongoose = require("mongoose");
const ListingSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    username: { type: String, required: true },
    requestorIds: { type: Array },
    title: { type: String },
    type: { type: String, required: true },
    categories: { type: Array, required: true, default: ["Others"] },
    image: { type: String },
    cloudimg: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    reserved: { type: Boolean },
    reservedBy: { type: String },
    dateOfTransaction: { type: Date },
    location: { type: String },
    depositAmount: { type: Number },
    chats: { type: Array },
    completed: { type: Boolean, default: false },
    like: { type: Number, default: 0 },
    usersLiked: { type: Array },
    comment: { type: Array, ref: "User" },
    description: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Listing", ListingSchema);
