const express = require("express");
const router = express.Router();

class CollectionsRouter {
  constructor(controller, checkJwt) {
    this.controller = controller;
    this.checkJwt = checkJwt;
  }

  routes() {
    router.get("/", this.controller.getAllCollections);
    router.post("/", this.checkJwt, this.controller.createCollection);

    router.get("/:userId", this.controller.getUserCollections);
    router.get("/:userId/:collectionId", this.controller.getCollectionInfo);

    router.post(
      "/:userId/:collectionId",
      this.checkJwt,
      this.controller.addBookToCollection
    );
    router.put(
      "/:userId/:collectionId",
      this.checkJwt,
      this.controller.updateCollection
    );
    router.put(
      "/:userId/:collectionId/:bookId",
      this.checkJwt,
      this.controller.removeBookFromCollection
    );
    router.delete(
      "/:userId/:collectionId",
      this.checkJwt,
      this.controller.deleteCollection
    );
    return router;
  }
}

module.exports = CollectionsRouter;
