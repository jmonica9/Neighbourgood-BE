const express = require("express");
const router = express.Router();

class PostRouter {
  constructor(controller) {
    this.controller = controller;
  }
  routes() {
    router.get("/", this.controller.getAll);
    router.post("/", this.controller.insertOne);
    router.get("/:postId", this.controller.getOne);
    router.put("/:postId", this.controller.updateOne);

    router.post("/:postId/like/add", this.controller.addLike);
    router.post("/:postId/like/remove", this.controller.removeLike);
    router.post("/:postId/comment", this.controller.addComment);

    return router;
  }
}

module.exports = PostRouter;
