const express = require("express");
const router = express.Router();

class MessageRouter {
  constructor(controller) {
    this.controller = controller;
  }
  routes() {
    router.delete("/", this.controller.deleteOneWithDate);
    router.get("/:chatroomId", this.controller.getChatRoomMessages);
    router.post("/:chatroomId/:userId", this.controller.insertOneWithoutDate);
    router.post(
      "/appointment/:chatroomId/:userId",
      this.controller.insertOneWithDate
    );

    return router;
  }
}

module.exports = MessageRouter;
