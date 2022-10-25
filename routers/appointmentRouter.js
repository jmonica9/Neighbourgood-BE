const express = require("express");
const router = express.Router();

class AppointmentRouter {
  constructor(controller) {
    this.controller = controller;
  }
  routes() {
    router.get("/", this.controller.getAll);
    router.post("/getinfo", this.controller.getOne);
    router.put("/", this.controller.confirmOneAppointment);
    router.post("/", this.controller.insertOne);
    router.delete("/", this.controller.deleteOne);

    return router;
  }
}

module.exports = AppointmentRouter;
