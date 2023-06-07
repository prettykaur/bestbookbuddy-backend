const BaseController = require("./baseController");

class CollectionsController extends BaseController {
  constructor(model, bookModel, userModel) {
    super(model);
    this.bookModel = bookModel;
    this.userModel = userModel;
  }

  // Get all collections

  // Get all of user's collections

  // Get info on specific collection

  // Create new collection

  // Add book to collection

  // Update collection

  // Remove book from collection

  // Delete collection
}

module.exports = CollectionsController;
