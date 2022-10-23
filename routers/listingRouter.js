const express = require("express");
const router = express.Router();

class ListingRouter {
  constructor(controller) {
    this.controller = controller;
  }
  routes() {
    router.get("/", this.controller.getAll);
    router.post("/", this.controller.insertOne);
    router.get("/single/:listingId", this.controller.getOne);
    // all listings for one type
    router.get("/:type", this.controller.getTypeListings);
    // sort listings by categories for one type
    router.post("/categories/:type", this.controller.sortByCategories);
    //delete listing
    router.post("/delete/:listingId", this.controller.deleteOne);
    //edit listing
    router.post("/edit/:listingId", this.controller.updateOne);
    //all listings for user
    router.get("/user/:userId", this.controller.getAllFromUser);

    //like and un-like listing
    router.post("/like/:listingId/add", this.controller.addLike);
    router.post("/like/:listingId/remove", this.controller.removeLike);

    //add listing comment
    router.get("/comment/:listingId", this.controller.getComments);
    router.post("/comment/:listingId", this.controller.addComment);

    //add requestorid
    router.post("/request", this.controller.addUserRequest);
    //withdraw requestorid
    router.post("/withdraw", this.controller.withdrawUserRequest);
    //all listings for one type where user is inside the requestorIds
    router.get("/:type/:userId/watchlist", this.controller.getMyTypeWatchlist);

    //my own listings according to type
    router.get("/:type/:userId", this.controller.getMyTypeListings);

    //update reservedBy field once an appointment has been confirmed
    router.put("/reserve", this.controller.reserveListing);

    //deposit payment for lending listings
    // router.get("/single/:listingId/payment", this.controller.getPaymentInfo);
    // router.post("/single/:listingId/payment", this.controller.addPayment);

    return router;
  }
}

module.exports = ListingRouter;
