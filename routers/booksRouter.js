const express = require("express");
const router = express.Router();

class BooksRouter {
  constructor(controller, checkJwt) {
    this.controller = controller;
    this.checkJwt = checkJwt;
  }

  routes() {
    router.get("/", this.controller.createBook);
    router.get("/:bookId", this.controller.getBook);

    return router;
  }
}

module.exports = BooksRouter;
