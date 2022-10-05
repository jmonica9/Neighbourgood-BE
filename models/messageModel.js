const mongoose = require("mongoose");
const MessageSchema = new mongoose.Schema(
  {
    chatId: { type: String, required: true },
    senderId: { type: String, required: true },
    messageText: { type: String, required: true },
    proposedDate: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", MessageSchema);
