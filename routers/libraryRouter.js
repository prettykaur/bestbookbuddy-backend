const express = require("express");
const router = express.Router();

class LibraryRouter {
  constructor(controller, checkJwt) {
    this.controller = controller;
    this.checkJwt = checkJwt;
  }

  routes() {
    router.get("/:userId", this.controller.getBooksInLibrary);
    router.get("/:userId/:bookId", this.controller.getBookStatusInLibrary);

    router.post("/:userId", this.checkJwt, this.controller.addBookToLibrary);
    router.put(
      "/:userId/:bookId",
      this.checkJwt,
      this.controller.updateBookInLibrary
    );
    router.delete(
      "/:userId/:bookId",
      this.checkJwt,
      this.controller.deleteBookFromLibrary
    );

    return router;
  }
}

module.exports = LibraryRouter;
