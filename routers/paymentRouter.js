const express = require("express");
const router = express.Router();

class PaymentRouter {
  constructor(controller) {
    this.controller = controller;
  }
  routes() {
    router.get("/", this.controller.getAll);
    router.post("/account", this.controller.createAccount);
    router.post("/", this.controller.addPayment);
    router.post("/customer", this.controller.addCustomer);
    router.post("/refund", this.controller.addRefund);
    router.post("/claimDeposit", this.controller.claimDeposit);
    router.post("/paymentMethod", this.controller.attachPaymentMethod);
    router.post("/addBalance", this.controller.addBalance);

    router.get("/:listingId", this.controller.getOne);
    router.post("/:listingId", this.controller.insertOne);
    router.put("/:listingId", this.controller.updateOne);

    return router;
  }
}

module.exports = PaymentRouter;
