const express = require("express");
const router = express.Router();

class FriendsRouter {
  constructor(controller, checkJwt) {
    this.controller = controller;
    this.checkJwt = checkJwt;
  }

  routes() {
    return router;
  }
}

module.exports = FriendsRouter;
