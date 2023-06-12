const express = require("express");
const router = express.Router();

class ReviewsRouter {
  constructor(controller, checkJwt) {
    this.controller = controller;
    this.checkJwt = checkJwt;
  }

  routes() {
    router.get("/:bookId", this.controller.getBookReviews);
    router.get("/user/:userId", this.controller.getAllUserBookReviews);
    router.get(
      "/user/:userId/book/:bookId",
      this.controller.getOneUserBookReview
    );

    router.post("/:bookId", this.checkJwt, this.controller.addBookReview);
    router.put("/:reviewId", this.checkJwt, this.controller.updateBookReview);
    router.delete(
      "/:reviewId",
      this.checkJwt,
      this.controller.deleteBookReview
    );

    router.get("/:reviewId/likes", this.controller.getBookReviewLikes);
    router.get("/:reviewId/likes/count", this.controller.countBookReviewLikes);

    router.get(
      "/user/:userId",
      this.checkJwt,
      this.controller.getLikedBookReviews
    );
    router.get(
      "/user/:userId/count",
      this.checkJwt,
      this.controller.countLikedBookReviews
    );

    router.post(
      "/:reviewId/like",
      this.checkJwt,
      this.controller.likeBookReview
    );
    router.delete(
      "/:reviewId/unlike",
      this.checkJwt,
      this.controller.unlikeBookReview
    );
    return router;
  }
}

module.exports = ReviewsRouter;
