const express = require("express");
const router = express.Router();

class UserRouter {
  constructor(controller, auth) {
    this.controller = controller;
  }
  routes() {
    router.get("/", this.controller.getAll);
    router.post("/login", this.controller.login);
    router.post("/register", this.controller.register);
    router.get("/jwtUser", this.controller.getJwtUser);
    router.get("/logout", this.controller.logout);
    return router;
  }
}

module.exports = UserRouter;
