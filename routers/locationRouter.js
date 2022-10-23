const express = require("express");
const router = express.Router();

class LocationRouter {
  constructor(controller, auth) {
    this.controller = controller;
  }
  routes() {
    router.get("/", this.controller.getAll);
    router.post("/insert", this.controller.insertOne);
    router.get("/distinct", this.controller.getDistinct);
    return router;
  }
}

module.exports = LocationRouter;
