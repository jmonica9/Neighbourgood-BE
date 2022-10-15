const express = require("express");
const router = express.Router();

class ChatRouter {
  constructor(controller) {
    this.controller = controller;
  }
  routes() {
    //get the chatroom's listing
    router.get("/:listingId", this.controller.getOneListing);
    router.post("/create/:listingId", this.controller.createChatroom);
    return router;
  }
}

module.exports = ChatRouter;
