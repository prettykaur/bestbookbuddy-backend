const BaseController = require("./baseController");
const { Op } = require("sequelize");

class BooksController extends BaseController {
  constructor(model, bookModel) {
    super(model);
    this.bookModel = bookModel;
  }

  // Create book in db
  createBook = async (req, res) => {
    const {
      title,
      olEditionKey,
      olEditionCount,
      isbn10,
      isbn13,
      olCoverId,
      olRatingsCount,
      olRatingsAverage,
      olAuthorKey,
      authorName,
    } = req.body;

    try {
      // Check if book already exists in db
      const existingBook = await this.bookModel.findOne({
        where: {
          title,
          [Op.or]: [{ isbn10 }, [isbn13]],
        },
      });

      if (existingBook) {
        return res
          .status(400)
          .json({ error: true, msg: "Book already exists" });
      }

      // Create new book record in db
      const newBook = await this.bookModel.create({
        title,
        olEditionKey,
        olEditionCount,
        isbn10,
        isbn13,
        olCoverId,
        olRatingsCount,
        olRatingsAverage,
        olAuthorKey,
        authorName,
      });

      return res.json(newBook);
    } catch (err) {
      console.error("Error creating book:", err);
      return res.status(500).json({ error: true, msg: err });
    }
  };

  // Get specific book
  getBook = async (req, res) => {
    const { bookId } = req.params;

    try {
      const book = await this.bookModel.findByPk(bookId);

      return res.json(book);
    } catch (err) {
      console.error("Error getting book:", err);
      return res.status(500).json({ error: true, msg: err });
    }
  };
}

module.exports = BooksController;
