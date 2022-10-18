const express = require("express");
const router = express.Router();

class AppointmentRouter {
  constructor(controller) {
    this.controller = controller;
  }
  routes() {
    router.post("/getinfo", this.controller.getOne);
    router.post("/", this.controller.insertOne);
    router.delete("/", this.controller.deleteOne);

    return router;
  }
}

module.exports = AppointmentRouter;
