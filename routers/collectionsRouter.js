const express = require("express");
const router = express.Router();

class CollectionsRouter {
  constructor(controller, checkJwt) {
    this.controller = controller;
    this.checkJwt = checkJwt;
  }

  routes() {
    return router;
  }
}

module.exports = CollectionsRouter;
