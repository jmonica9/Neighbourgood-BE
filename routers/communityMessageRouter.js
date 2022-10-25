const express = require("express");
const router = express.Router();

class CommunityMessageRouter {
  constructor(controller) {
    this.controller = controller;
  }
  routes() {
    router.post("/", this.controller.insertOne);
    router.get("/", this.controller.getAll);
    return router;
  }
}

module.exports = CommunityMessageRouter;
