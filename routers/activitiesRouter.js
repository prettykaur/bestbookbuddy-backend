const express = require("express");
const router = express.Router();

class ActivitiesRouter {
  constructor(controller, checkJwt) {
    this.controller = controller;
    this.checkJwt = checkJwt;
  }

  routes() {
    return router;
  }
}

module.exports = ActivitiesRouter;
