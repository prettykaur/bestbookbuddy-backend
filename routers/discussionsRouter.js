const express = require("express");
const router = express.Router();

class DiscussionsRouter {
  constructor(controller, checkJwt) {
    this.controller = controller;
    this.checkJwt = checkJwt;
  }

  routes() {
    router.get("/", this.controller.getAllDiscussions);
    router.get("/user/:userId", this.controller.getDiscussionsByUser);
    router.get("/user/:userId/comments", this.controller.getCommentsByUser);

    router.get(
      "/:discussionId/likes",
      this.controller.getUsersWhoLikedDiscussion
    );
    router.get(
      "/:discussionId/likes/count",
      this.controller.countDiscussionLikes
    );

    router.get(
      "/user/:userId/likes",
      this.controller.getDiscussionsLikedByUser
    );
    router.get(
      "/user/:userId/likes/count",
      this.controller.countLikedDiscussionsByUser
    );

    router.post(
      "/:discussionId/like",
      this.checkJwt,
      this.controller.likeDiscussion
    );
    router.delete(
      "/:discussionId/unlike",
      this.checkJwt,
      this.controller.unlikeDiscussion
    );

    router.get("/:discussionId", this.controller.getDiscussion);
    router.get("/:discussionId/:commentId", this.controller.getComment);

    router.post("/:bookId", this.checkJwt, this.controller.addDiscussion);
    router.post(
      "/:bookId/:discussionId",
      this.checkJwt,
      this.controller.addComment
    );

    router.put(
      "/:discussionId",
      this.checkJwt,
      this.controller.updateDiscussion
    );
    router.put(
      "/:discussionId/:commentId",
      this.checkJwt,
      this.controller.updateComment
    );

    router.delete(
      "/:discussionId",
      this.checkJwt,
      this.controller.deleteDiscussion
    );
    router.delete(
      "/:discussionId/:commentId",
      this.checkJwt,
      this.controller.deleteComment
    );

    return router;
  }
}

module.exports = DiscussionsRouter;
