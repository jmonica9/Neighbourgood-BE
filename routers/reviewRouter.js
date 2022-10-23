const express = require("express");
const router = express.Router();

class ReviewRouter {
  constructor(controller, auth) {
    this.controller = controller;
  }
  routes() {
    router.get("/", this.controller.getAll);
    router.get("/getOneListing/:listingId", this.controller.getOneListing);
    router.post("/insertOne/:listingId", this.controller.insertOne);
    return router;
  }
}

module.exports = ReviewRouter;
