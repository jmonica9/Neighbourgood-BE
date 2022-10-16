const express = require("express");
const router = express.Router();

class ListingRouter {
  constructor(controller) {
    this.controller = controller;
  }
  routes() {
    router.get("/", this.controller.getAll);
    router.post("/", this.controller.insertOne);
    // all listings for one type
    router.get("/:type", this.controller.getTypeListings);
    // sort listings by categories for one type
    router.post("/categories/:type", this.controller.sortByCategories);
    //delete listing
    router.post("/delete/:listingId", this.controller.deleteOne);
    //all listings for user
    router.get("/user/:userId", this.controller.getAllFromUser);

    //add requestorid
    router.post("/request", this.controller.addUserRequest);
    //withdraw requestorid
    router.post("/withdraw", this.controller.withdrawUserRequest);
    //all listings for one type where user is inside the requestorIds
    router.get("/:type/:userId/watchlist", this.controller.getMyTypeWatchlist);

    //my own listings according to type
    router.get("/:type/:userId", this.controller.getMyTypeListings);

    return router;
  }
}

module.exports = ListingRouter;
