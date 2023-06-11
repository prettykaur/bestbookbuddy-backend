const BaseController = require("./baseController");

class LibraryController extends BaseController {
  constructor(model, bookModel, readingStatusModel, userModel, activityModel) {
    super(model);
    this.bookModel = bookModel;
    this.readingStatusModel = readingStatusModel;
    this.userModel = userModel;
    this.activityModel = activityModel;
  }

  // Get books in library
  getBooksInLibrary = async (req, res) => {
    const { userId } = req.params;

    try {
      // Find user along with books in library and reading status
      const user = await this.userModel.findByPk(userId, {
        include: [
          {
            model: this.model,
            include: [
              {
                model: this.bookModel,
                attributes: ["id", "title", "olCoverId", "authorName"],
              },
              {
                model: this.readingStatusModel,
                as: "readingStatus",
                attributes: ["id", "status"],
              },
              {
                model: this.userModel,
                attributes: ["id", "username", "email", "photoUrl"],
              },
            ],
          },
        ],
      });

      if (!user) {
        return res.status(404).json({ error: true, msg: "User not found" });
      }

      const books = user.userbooks.map((userbook) => {
        const { book, readingStatus, user } = userbook;
        const { id, title, olCoverId, authorName } = book;
        const { username, email, photoUrl } = user;

        return {
          id,
          title,
          author: authorName,
          status: readingStatus.status,
          olCoverId,
          user: {
            username,
            email,
            photoUrl,
          },
        };
      });

      return res.json(books);
    } catch (err) {
      console.log("Error getting books from library:", err);
      return res.status(400).json({ error: true, msg: err });
    }
  };

  // Get single book's status
  getBookStatusInLibrary = async (req, res) => {
    const { userId, bookId } = req.params;

    try {
      // Check if user and book exist
      const user = await this.userModel.findByPk(userId);
      const book = await this.bookModel.findByPk(bookId);

      if (!user) {
        return res.status(404).json({ error: true, msg: "User not found" });
      } else if (!book) {
        return res.status(404).json({ error: true, msg: "Book not found" });
      }

      // Find entry in user_books table
      const userBook = await this.model.findOne({
        where: { userId, bookId },
        include: [
          {
            model: this.bookModel,
            attributes: ["id", "title", "olCoverId", "authorName"],
          },
          {
            model: this.readingStatusModel,
            as: "readingStatus",
            attributes: ["id", "status"],
          },
          {
            model: this.userModel,
            attributes: ["id", "username", "email", "photoUrl"],
          },
        ],
      });

      if (!userBook) {
        return res
          .status(404)
          .json({ error: true, msg: "Book not found in user's library" });
      }

      return res.json({
        success: true,
        msg: "Successfully fetched book status from library",
        readingStatus: userBook.readingStatus,
        book: userBook.book,
        user: userBook.user,
      });
    } catch (err) {
      console.log("Error fetching book status from library:", err);
      return res.status(500).json({ error: true, msg: err.message });
    }
  };

  // Add book to library
  addBookToLibrary = async (req, res) => {
    const { userId } = req.params;
    const { bookId, status } = req.body;

    try {
      // Check if user and book exist
      const user = await this.userModel.findByPk(userId);
      const book = await this.bookModel.findByPk(bookId);

      if (!user) {
        return res.status(404).json({ error: true, msg: "User not found" });
      } else if (!book) {
        return res.status(404).json({ error: true, msg: "Book not found" });
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

      // Check if book is already in user's library
      const existingUserBook = await this.model.findOne({
        where: { userId, bookId, statusId: readingStatus.id },
      });

      if (existingUserBook) {
        return res
          .status(400)
          .json({ error: true, msg: "Book already in user's library" });
      }

      // Create new entry in user_books table
      await this.model.create({
        userId,
        bookId,
        statusId: readingStatus.id,
      });

      const newUserBook = await this.model.findOne({
        where: { userId, bookId, statusId: readingStatus.id },
        include: [
          {
            model: this.bookModel,
            attributes: ["id", "title", "olCoverId", "authorName"],
          },
          {
            model: this.readingStatusModel,
            as: "readingStatus",
            attributes: ["id", "status"],
          },
          {
            model: this.userModel,
            attributes: ["id", "username", "email", "photoUrl"],
          },
        ],
      });

      // Log activity
      try {
        await this.activityModel.create({
          userId,
          activityType: "created",
          targetId: newUserBook.id,
          targetType: "library",
        });
      } catch (activityError) {
        console.log("Failed to log activity:", activityError);
      }

      return res.json(newUserBook);
    } catch (err) {
      console.log("Error adding book to library:", err);
      return res.status(500).json({ error: true, msg: err });
    }
  };

  // Update book in library
  updateBookInLibrary = async (req, res) => {
    const { userId, bookId } = req.params;
    const { currentStatus, newStatus } = req.body;

    try {
      // Check if user and book exist
      const user = await this.userModel.findByPk(userId);
      const book = await this.bookModel.findByPk(bookId);

      if (!user || !book) {
        return res
          .status(404)
          .json({ error: true, msg: "User or book not found" });
      }

      // Find current reading status
      const currentReadingStatus = await this.readingStatusModel.findOne({
        where: { status: currentStatus },
      });

      if (!currentReadingStatus) {
        return res
          .status(400)
          .json({ error: true, msg: "Invalid reading status option" });
      }

      // Find entry in user_books table
      const userBook = await this.model.findOne({
        where: { userId, bookId, statusId: currentReadingStatus.id },
        include: [
          {
            model: this.bookModel,
            attributes: ["id", "title", "olCoverId", "authorName"],
          },
          {
            model: this.readingStatusModel,
            as: "readingStatus",
            attributes: ["id", "status"],
          },
          {
            model: this.userModel,
            attributes: ["id", "username", "email", "photoUrl"],
          },
        ],
      });

      if (!userBook) {
        return res
          .status(404)
          .json({ error: true, msg: "Book not found in user's library" });
      }

      // Find new reading status
      const newReadingStatus = await this.readingStatusModel.findOne({
        where: { status: newStatus },
      });

      if (newReadingStatus.id === currentReadingStatus.id) {
        return res.status(400).json({
          error: true,
          msg: "Please select a different reading status",
        });
      }

      if (!newReadingStatus) {
        return res
          .status(400)
          .json({ error: true, msg: "Invalid reading status option" });
      }

      // Update entry in user_books table with new status
      userBook.statusId = newReadingStatus.id;
      await userBook.save();

      // Reload to get updated status
      await userBook.reload();

      // Log activity
      try {
        await this.activityModel.create({
          userId,
          activityType: "updated",
          targetId: userBook.id,
          targetType: "library",
        });
      } catch (activityError) {
        console.log("Failed to log activity:", activityError);
      }

      return res.json({
        success: true,
        msg: "Status in library updated successfully",
        userBook,
      });
    } catch (err) {
      console.log("Error adding book to library:", err);
      return res.status(500).json({ error: true, msg: err });
    }
  };

  // Delete book from library
  deleteBookFromLibrary = async (req, res) => {
    const { userId, bookId } = req.params;

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
        include: [
          {
            model: this.bookModel,
            attributes: ["id", "title", "olCoverId", "authorName"],
          },
          {
            model: this.readingStatusModel,
            as: "readingStatus",
            attributes: ["id", "status"],
          },
          {
            model: this.userModel,
            attributes: ["id", "username", "email", "photoUrl"],
          },
        ],
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
