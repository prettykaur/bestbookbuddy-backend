const express = require("express");
const router = express.Router();

class LibraryRouter {
  constructor(controller, checkJwt) {
    this.controller = controller;
    this.checkJwt = checkJwt;
  }

  routes() {
    router.get(
      "/:userId/:status",
      this.checkJwt,
      this.controller.getBooksInLibrary
    );
    router.post(
      "/:userId/:status",
      this.checkJwt,
      this.controller.addBookToLibrary
    );
    router.put(
      "/:userId/:status/:bookId",
      this.checkJwt,
      this.controller.updateBookInLibrary
    );
    router.delete(
      "/:userId/:status/:bookId",
      this.checkJwt,
      this.controller.deleteBookFromLibrary
    );

    return router;
  }
}

module.exports = LibraryRouter;
