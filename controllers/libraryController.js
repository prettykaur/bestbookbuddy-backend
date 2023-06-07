const BaseController = require("./baseController");

class LibraryController extends BaseController {
  constructor(model, bookModel, readingStatusModel, userModel) {
    super(model);
    this.bookModel = bookModel;
    this.readingStatusModel = readingStatusModel;
    this.userModel = userModel;
  }

  // Get books in library
  getBooksInLibrary = async (req, res) => {
    const { userId, status } = req.params;

    try {
      // Find the reading status based on the provided status
      const readingStatus = await this.readingStatusModel.findOne({
        where: { status },
      });

      if (!readingStatus) {
        return res
          .status(400)
          .json({ error: true, msg: "Invalid reading status" });
      }

      const books = await this.model.findAll({
        where: { userId, statusId: readingStatus.id },
        include: [{ model: this.bookModel }],
      });

      return res.json(books);
    } catch (err) {
      console.log("Error getting books from library:", err);
      return res.status(400).json({ error: true, msg: err });
    }
  };

  // Add book to library
  addBookToLibrary = async (req, res) => {
    const { userId, status } = req.params;
    const { bookId } = req.body;

    try {
      // Check if user and book exist
      const user = await this.userModel.findByPk(userId);
      const book = await this.bookModel.findByPk(bookId);

      if (!user || !book) {
        return res
          .status(404)
          .json({ error: true, msg: "User or book not found" });
      }

      console.log(status);
      // Check if book is already in user's library
      const existingUserBook = await this.model.findOne({
        where: { userId, bookId },
      });

      if (existingUserBook) {
        return res
          .status(400)
          .json({ error: true, msg: "Book already in user's library" });
      }

      // Find reading status
      const readingStatus = await this.readingStatusModel.findOne({
        where: { status },
      });

      if (!readingStatus) {
        return res
          .status(400)
          .json({ error: true, msg: "Invalid reading status option" });
      }

      // Create new entry in user_books table
      const newUserBook = await this.model.create({
        userId,
        bookId,
        statusId: readingStatus.id,
      });

      return res.json(newUserBook);
    } catch (err) {
      console.log("Error adding book to library:", err);
      return res.status(500).json({ error: true, msg: err });
    }
  };

  // Update book in library
  updateBookInLibrary = async (req, res) => {
    const { userId, bookId, status } = req.params;
    const { newStatus } = req.body;

    try {
      // Check if user and book exist
      const user = await this.userModel.findByPk(userId);
      const book = await this.bookModel.findByPk(bookId);

      if (!user || !book) {
        return res
          .status(404)
          .json({ error: true, msg: "User or book not found" });
      }

      // Find entry in user_books table
      const userBook = await this.model.findOne({
        where: { userId, bookId },
      });

      if (!userBook) {
        return res
          .status(404)
          .json({ error: true, msg: "Book not found in user's library" });
      }

      // Find new reading status
      const readingStatus = await this.readingStatusModel.findOne({
        where: { status: newStatus },
      });

      if (!readingStatus) {
        return res
          .status(400)
          .json({ error: true, msg: "Invalid reading status option" });
      }

      // Update entry in user_books table with new status
      userBook.statusId = readingStatus.id;
      await userBook.save();

      return res.json(userBook);
    } catch (err) {
      console.log("Error adding book to library:", err);
      return res.status(500).json({ error: true, msg: err });
    }
  };

  // Delete book from library
  deleteBookFromLibrary = async (req, res) => {
    const { userId, bookId, status } = req.params;

    try {
      // Check if user and book exist
      const user = await this.userModel.findByPk(userId);
      const book = await this.bookModel.findByPk(bookId);

      if (!user || !book) {
        return res
          .status(404)
          .json({ error: true, msg: "User or book not found" });
      }

      // Find reading status
      const readingStatus = await this.readingStatusModel.findOne({
        where: { status },
      });

      if (!readingStatus) {
        return res
          .status(400)
          .json({ error: true, msg: "Invalid reading status option" });
      }

      // Find entry in user_books table
      const userBook = await this.model.findOne({
        where: { userId, bookId, statusId: readingStatus.id },
      });

      if (!userBook) {
        return res
          .status(404)
          .json({ error: true, msg: "Book not found in user's library" });
      }

      // Delete entry
      await userBook.destroy();

      return res.json({
        success: true,
        msg: "Book successfully deleted from library",
      });
    } catch (err) {
      console.log("Error deleting book from library:", err);
      return res.status(500).json({ error: true, msg: err });
    }
  };
}

module.exports = LibraryController;
