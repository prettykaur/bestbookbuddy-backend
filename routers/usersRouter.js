const express = require("express");
const router = express.Router();

class UsersRouter {
  constructor(controller, checkJwt) {
    this.controller = controller;
    this.checkJwt = checkJwt;
  }

  routes() {
    router.get("/", this.controller.getAll);
    router.get("/:userId", this.controller.getUserProfile);

    router.post("/", this.checkJwt, this.controller.createUser);
    router.put("/:userId", this.checkJwt, this.controller.updateUserProfile);
    router.delete("/:userId", this.checkJwt, this.controller.deleteUser);

    router.get("/search/:username", this.controller.searchUsersByUsername);

    return router;
  }
}

module.exports = UsersRouter;
