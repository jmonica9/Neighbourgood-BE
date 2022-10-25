const mongoose = require("mongoose");
const communityMessageSchema = new mongoose.Schema(
  {
    senderId: { type: String, required: true },
    senderName: { type: String, required: true },
    messageText: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CommunityMessage", communityMessageSchema);
