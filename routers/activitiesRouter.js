const express = require("express");
const router = express.Router();

class ActivitiesRouter {
  constructor(controller, checkJwt) {
    this.controller = controller;
    this.checkJwt = checkJwt;
  }

  routes() {
    router.get("/:userId", this.checkJwt, this.controller.getFeedForUser);
    return router;
  }
}

module.exports = ActivitiesRouter;
