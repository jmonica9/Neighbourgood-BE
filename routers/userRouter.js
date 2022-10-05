const express = require("express");
const router = express.Router();

class UserRouter {
  constructor(controller, auth) {
    this.controller = controller;
  }
  routes() {
    router.get("/", this.controller.getAll);

    return router;
  }
}

module.exports = UserRouter;
