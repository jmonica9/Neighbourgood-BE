const express = require("express");
const router = express.Router();

class MessageRouter {
  constructor(controller) {
    this.controller = controller;
  }
  routes() {
    router.get("/:chatroomId", this.controller.getChatRoomMessages);
    router.post("/:chatroomId/:userId", this.controller.insertOneWithoutDate);

    return router;
  }
}

module.exports = MessageRouter;
