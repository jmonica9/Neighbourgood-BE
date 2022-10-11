const express = require("express");
const router = express.Router();

class ListingRouter {
  constructor(controller) {
    this.controller = controller;
  }
  routes() {
    router.get("/", this.controller.getAll);
    router.post("/", this.controller.insertOne);

    return router;
  }
}

module.exports = ListingRouter;
