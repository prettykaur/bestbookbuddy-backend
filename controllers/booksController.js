const BaseController = require("./baseController");

class BooksController extends BaseController {
  constructor(model, bookModel) {
    super(model);
    this.bookModel = bookModel;
  }
}

module.exports = BooksController;
