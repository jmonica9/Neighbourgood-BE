const express = require("express");
const router = express.Router();

class UserRouter {
  constructor(controller, auth) {
    this.controller = controller;
  }
  routes() {
    router.get("/", this.controller.getAll);
    router.get("/:userId", this.controller.getOne);
    router.put("/:userId", this.controller.updateOne);
    return router;
  }
}

module.exports = UserRouter;
