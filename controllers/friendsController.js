const BaseController = require("./baseController");

class FriendsController extends BaseController {
  constructor(
    model,
    friendRequestModel,
    friendRequestStatusModel,
    friendModel
  ) {
    super(model);
    this.friendRequestModel = friendRequestModel;
    this.friendRequestStatusModel = friendRequestStatusModel;
    this.friendModel = friendModel;
  }
}

module.exports = FriendsController;
