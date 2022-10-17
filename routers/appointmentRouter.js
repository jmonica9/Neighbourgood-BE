const express = require("express");
const router = express.Router();

class AppointmentRouter {
  constructor(controller) {
    this.controller = controller;
  }
  routes() {
    router.get("/", this.controller.getOne);
    router.post("/", this.controller.insertOne);

    return router;
  }
}

module.exports = AppointmentRouter;
