const BaseController = require("./baseController");

class CollectionsController extends BaseController {
  constructor(model, bookModel, userModel) {
    super(model);
    this.bookModel = bookModel;
    this.userModel = userModel;
  }

  // Get all collections
  getAllCollections = async (req, res) => {
    try {
      const collections = await this.model.findAll({
        include: [
          {
            model: this.bookModel,
            attributes: ["id", "title", "olCoverId", "authorName"],
          },
          {
            model: this.userModel,
            attributes: ["id", "username", "email", "photoUrl"],
          },
        ],
      });
      return res.json(collections);
    } catch (err) {
      console.log("Error fetching collections:", err);
      return res.status(500).json({ error: true, msg: err.message });
    }
  };

  // Get all of user's collections
  getUserCollections = async (req, res) => {
    const { userId } = req.params;

    try {
      const collections = await this.model.findAll({
        where: { userId },
        include: {
          model: this.bookModel,
          attributes: ["id", "title", "olCoverId", "authorName"],
        },
      });
      return res.json(collections);
    } catch (err) {
      console.log("Error fetching user's collections:", err);
      return res.status(500).json({ error: true, msg: err.message });
    }
  };

  // Get info on specific collection
  getCollectionInfo = async (req, res) => {
    const { userId, collectionId } = req.params;

    try {
      const collection = await this.model.findOne({
        where: { id: collectionId, userId },
        include: [
          {
            model: this.bookModel,
            attributes: ["id", "title", "olCoverId", "authorName"],
          },
          {
            model: this.userModel,
            attributes: ["id", "username", "email", "photoUrl"],
          },
        ],
      });
      return res.json(collection);
    } catch (err) {
      console.log("Error fetching collection info:", err);
      return res.status(500).json({ error: true, msg: err.message });
    }
  };

  // Create new collection
  createCollection = async (req, res) => {
    const { userId, name, description } = req.body;

    try {
      const newCollection = await this.model.create({
        userId,
        name,
        description,
      });
      return res.json(newCollection);
    } catch (err) {
      console.log("Error creating new collection:", err);
      return res.status(500).json({ error: true, msg: err.message });
    }
  };

  // Add book to collection
  addBookToCollection = async (req, res) => {
    const { userId, collectionId } = req.params;
    const { bookId } = req.body;

    try {
      const collection = await this.model.findOne({
        where: { id: collectionId, userId },
      });

      if (!collection) {
        return res
          .status(404)
          .json({ error: true, msg: "Collection not found" });
      }

      const book = await this.bookModel.findByPk(bookId);

      if (!book) {
        return res.status(404).json({ error: true, msg: "Book not found" });
      }

      await collection.addBook(book);

      return res.json({
        success: true,
        msg: "Book added to collection",
        book,
        collection,
      });
    } catch (err) {
      console.log("Error adding book to collection:", err);
      return res.status(500).json({ error: true, msg: err.message });
    }
  };

  // Update collection
  updateCollection = async (req, res) => {
    const { userId, collectionId } = req.params;
    const { name, description } = req.body;

    try {
      const collection = await this.model.findByPk(collectionId);

      if (collection) {
        await this.model.update(
          { name, description },
          { where: { id: collectionId, userId } }
        );

        const updatedCollection = await this.model.findOne({
          where: { id: collectionId, userId },
          include: [
            {
              model: this.userModel,
              attributes: ["id", "username", "email", "photoUrl"],
            },
          ],
        });

        return res.json({
          success: true,
          msg: "Collection updated",
          updatedCollection,
        });
      } else {
        return res
          .status(404)
          .json({ error: true, msg: "Collection not found" });
      }
    } catch (err) {
      console.log("Error updating collection:", err);
      return res.status(500).json({ error: true, msg: err.message });
    }
  };

  // Remove book from collection
  removeBookFromCollection = async (req, res) => {
    const { userId, collectionId, bookId } = req.params;

    try {
      const collection = await this.model.findOne({
        where: { id: collectionId, userId },
      });

      if (!collection) {
        return res
          .status(404)
          .json({ error: true, msg: "Collection not found" });
      }

      const book = await this.bookModel.findByPk(bookId);

      if (!book) {
        return res.status(404).json({ error: true, msg: "Book not found" });
      }

      await collection.removeBook(book);

      return res.json({
        success: true,
        msg: "Book removed from collection",
        book,
        collection,
      });
    } catch (err) {
      console.log("Error removing book from collection:", err);
      return res.status(500).json({ error: true, msg: err.message });
    }
  };

  // Delete collection
  deleteCollection = async (req, res) => {
    const { userId, collectionId } = req.params;

    try {
      const collection = await this.model.findOne({
        where: { id: collectionId, userId },
      });

      if (!collection) {
        return res
          .status(404)
          .json({ error: true, msg: "Collection not found" });
      }

      const booksInCollection = await collection.getBooks();

      await collection.removeBooks(booksInCollection);

      await collection.destroy();

      return res.json({ success: true, msg: "Collection deleted" });
    } catch (err) {
      console.log("Error deleting collection:", err);
      return res.status(500).json({ error: true, msg: err.message });
    }
  };
}

module.exports = CollectionsController;
