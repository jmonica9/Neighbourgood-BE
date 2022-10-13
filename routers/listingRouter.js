const express = require("express");
const router = express.Router();

class ListingRouter {
  constructor(controller) {
    this.controller = controller;
  }
  routes() {
    router.get("/", this.controller.getAll);
    router.post("/", this.controller.insertOne);
    //all listings for one type where user is inside the requestorIds
    router.get("/:type/:userId/watchlist", this.controller.getMyTypeWatchlist);
    // all listings for one type
    router.get("/:type", this.controller.getTypeListings);
    //my own listings according to type
    router.get("/:type/:userId", this.controller.getMyTypeListings);

    return router;
  }
}

module.exports = ListingRouter;
