const mongoose = require("mongoose");
const ChatSchema = new mongoose.Schema(
  {
    listingId: { type: String, required: true },
    requestorId: { type: String, required: true },
    ownerId: { type: String, required: true },
    messages: { type: Array },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", ChatSchema);
