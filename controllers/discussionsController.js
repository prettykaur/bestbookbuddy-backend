const BaseController = require("./baseController");

class DiscussionsController extends BaseController {
  constructor(model, bookModel, userModel) {
    super(model);
    this.bookModel = bookModel;
    this.userModel = userModel;
  }
}

module.exports = DiscussionsController;
