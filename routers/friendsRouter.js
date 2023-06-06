const express = require("express");
const router = express.Router();

class FriendsRouter {
  constructor(controller, checkJwt) {
    this.controller = controller;
    this.checkJwt = checkJwt;
  }

  routes() {
    router.get("/:userId", this.checkJwt, this.controller.getFriends);
    router.get(
      "/:userId/friend-requests",
      this.checkJwt,
      this.controller.getFriendRequests
    );
    router.get(
      "/:userId/sent-requests",
      this.checkJwt,
      this.controller.getSentFriendRequests
    );
    router.get(
      "/:userId/received-requests",
      this.checkJwt,
      this.controller.getReceivedFriendRequests
    );
    router.post(
      "/:userId/send-friend-request",
      this.checkJwt,
      this.controller.sendFriendRequest
    );
    router.put(
      "/:userId/friend-requests/:requestId",
      this.checkJwt,
      this.controller.updateFriendRequestStatus
    );

    return router;
  }
}

module.exports = FriendsRouter;
