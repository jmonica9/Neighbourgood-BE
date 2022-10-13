const express = require("express");
const router = express.Router();

class ListingRouter {
  constructor(controller) {
    this.controller = controller;
  }
  routes() {
    router.get("/", this.controller.getAll);
    router.post("/", this.controller.insertOne);
    router.post("/request", this.controller.addUserRequest);
    router.get("/:userId", this.controller.getAllFromUser);

    return router;
  }
}

module.exports = ListingRouter;
