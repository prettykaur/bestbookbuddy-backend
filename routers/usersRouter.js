const express = require("express");
const router = express.Router();

class UsersRouter {
  constructor(controller, checkJwt) {
    this.controller = controller;
    this.checkJwt = checkJwt;
  }

  routes() {
    router.get("/", this.controller.getAll);

    return router;
  }
}

module.exports = UsersRouter;
