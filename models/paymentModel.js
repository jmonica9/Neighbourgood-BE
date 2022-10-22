const mongoose = require("mongoose");
const PaymentSchema = new mongoose.Schema(
  {
    listingId: { type: String, required: true },
    payerId: { type: String, required: true },
    receiverId: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, required: true }, // on hold, completed
    chargeId: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", PaymentSchema);
