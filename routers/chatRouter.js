const express = require("express");
const router = express.Router();

class ChatRouter {
  constructor(controller) {
    this.controller = controller;
  }
  routes() {
    //get the chatroom's listing

    router.get("/:chatroomId", this.controller.getOneChatroom);
    router.get("/listing/:listingId", this.controller.getOneListing);
    router.get("/user/:userId", this.controller.getAllUserChatrooms);
    router.post("/join", this.controller.joinOneChatroom);
    router.post("/create/:listingId", this.controller.createChatroom);
    router.delete("/delete/:listingId/:userId", this.controller.deleteChatroom);

    return router;
  }
}

module.exports = ChatRouter;
