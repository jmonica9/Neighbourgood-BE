const express = require("express");
const router = express.Router();

class UserRouter {
  constructor(controller, auth) {
    this.controller = controller;
  }
  routes() {
    router.get("/", this.controller.getAll);
    router.get("/:userId", this.controller.getOne);
    router.get("/profile/:username", this.controller.getOneUsername);
    router.put("/:userId", this.controller.updateOne);
    router.post(
      "/:userId/profilepicture",
      this.controller.updateProfilePicture
    );
    router.post("/:userId/updateFriend", this.controller.updateFriend);

    return router;
  }
}

module.exports = UserRouter;
