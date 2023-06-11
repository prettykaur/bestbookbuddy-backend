const BaseController = require("./baseController");

class ReviewsController extends BaseController {
  constructor(model, bookModel, userModel, activityModel) {
    super(model);
    this.bookModel = bookModel;
    this.userModel = userModel;
    this.activityModel = activityModel;
  }

  // Get reviews for book
  getBookReviews = async (req, res) => {
    const { bookId } = req.params;

    try {
      const reviews = await this.model.findAll({
        where: { bookId },
        include: [
          {
            model: this.userModel,
            attributes: ["id", "username", "email", "photoUrl"],
          },
          {
            model: this.bookModel,
            attributes: ["id", "title"],
          },
        ],
      });

      if (reviews.length === 0) {
        return res.status(404).json({ error: true, msg: "No reviews found" });
      }

      return res.json(reviews);
    } catch (err) {
      console.log("Error fetching reviews:", err);
      return res.status(400).json({ error: true, msg: err });
    }
  };

  // Add review for book
  addBookReview = async (req, res) => {
    const { bookId } = req.params;
    const { userId, rating, title, body } = req.body;

    try {
      const existingReview = await this.model.findAll({
        where: { userId, bookId },
      });

      if (existingReview.length > 0) {
        return res.status(409).json({
          error: true,
          msg: "User has already left review for this book",
        });
      }

      const newReview = await this.model.create({
        userId,
        bookId,
        rating,
        title,
        body,
      });

      // Log activity
      try {
        await this.activityModel.create({
          userId,
          activityType: "created",
          targetId: newReview.id,
          targetType: "review",
        });
      } catch (activityError) {
        console.log("Failed to log activity:", activityError);
      }

      // Eager load user and book data
      const reviewWithDetails = await this.model.findOne({
        where: { id: newReview.id },
        include: [
          {
            model: this.userModel,
            attributes: ["id", "username", "email", "photoUrl"],
          },
          { model: this.bookModel, attributes: ["id", "title"] },
        ],
      });

      return res.status(201).json(reviewWithDetails);
    } catch (err) {
      console.log("Error creating book review:", err);
      return res.status(500).json({ error: true, msg: err });
    }
  };

  // Update book review
  updateBookReview = async (req, res) => {
    const { reviewId } = req.params;
    const { userId, rating, title, body } = req.body;

    try {
      const existingReview = await this.model.findOne({
        where: { id: reviewId, userId },
      });

      if (!existingReview) {
        return res.status(404).json({ error: true, msg: "Review not found" });
      }

      existingReview.rating = rating;
      existingReview.title = title;
      existingReview.body = body;
      await existingReview.save();

      // Log activity
      try {
        await this.activityModel.create({
          userId,
          activityType: "updated",
          targetId: existingReview.id,
          targetType: "review",
        });
      } catch (activityError) {
        console.log("Failed to log activity:", activityError);
      }

      // Eager load user and book data
      const updatedReview = await this.model.findOne({
        where: { id: reviewId },
        include: [
          {
            model: this.userModel,
            attributes: ["id", "username", "email", "photoUrl"],
          },
          { model: this.bookModel, attributes: ["id", "title"] },
        ],
      });

      return res.json(updatedReview);
    } catch (err) {
      console.log("Error updating book review:", err);
      return res.status(500).json({ error: true, msg: err });
    }
  };

  // Delete book review
  deleteBookReview = async (req, res) => {
    const { reviewId } = req.params;
    const { userId } = req.body;

    try {
      const existingReview = await this.model.findOne({
        where: { id: reviewId, userId },
        include: [
          {
            model: this.userModel,
            as: "likedBy",
            through: {
              attributes: [],
            },
          },
        ],
      });

      if (!existingReview) {
        return res.status(404).json({ error: true, msg: "Review not found" });
      }

      // Log activity
      try {
        await this.activityModel.create({
          userId,
          activityType: "deleted",
          targetId: existingReview.id,
          targetType: "review",
        });
      } catch (activityError) {
        console.log("Failed to log activity:", activityError);
      }

      // Fetch and delete all likes associated with review
      await existingReview.removeLikedBy(existingReview.likedBy);

      // Then delete review
      await existingReview.destroy();

      return res.json({ success: true, msg: "Review deleted successfully" });
    } catch (err) {
      console.log("Error deleting book review:", err);
      return res.status(500).json({ error: true, msg: err });
    }
  };

  // Get all users who have liked book review
  getBookReviewLikes = async (req, res) => {
    const { reviewId } = req.params;

    try {
      const bookReview = await this.model.findByPk(reviewId);

      if (bookReview) {
        const likes = await bookReview.getLikedBy();
        return res.json(likes);
      } else {
        return res.status(404).json({ error: true, msg: "Review not found" });
      }
    } catch (err) {
      console.log("Error getting likes:", err);
      return res.status(400).json({ error: true, msg: err });
    }
  };

  // Count likes for book review
  countBookReviewLikes = async (req, res) => {
    const { reviewId } = req.params;

    try {
      const bookReview = await this.model.findByPk(reviewId);

      if (bookReview) {
        const count = await bookReview.countLikedBy();
        return res.json({ count });
      } else {
        return res.status(404).json({ error: true, msg: "Review not found" });
      }
    } catch (err) {
      console.log("Error counting likes:", err);
      return res.status(500).json({ error: true, msg: err });
    }
  };

  // Get book reviews liked by user
  getLikedBookReviews = async (req, res) => {
    const { userId } = req.params;

    try {
      const user = await this.userModel.findByPk(userId);
      const likedReviews = await user.getLikedReviews();
      return res.json(likedReviews);
    } catch (err) {
      console.log("Error fetching liked reviews");
      return res.status(500).json({ error: true, msg: err });
    }
  };

  // Like book review
  likeBookReview = async (req, res) => {
    const { reviewId } = req.params;
    const { userId } = req.body;

    try {
      const user = await this.userModel.findByPk(userId);
      const bookReview = await this.model.findByPk(reviewId);
      console.log(Object.keys(user.__proto__));

      if (user && bookReview) {
        await user.addLikedReviews(bookReview);
        // Log activity
        try {
          await this.activityModel.create({
            userId,
            activityType: "liked",
            targetId: reviewId,
            targetType: "review",
          });
        } catch (activityError) {
          console.log("Failed to log activity:", activityError);
        }
        return res.json({ success: true, msg: "Successfully liked review" });
      } else {
        return res
          .status(404)
          .json({ error: true, msg: "User or review not found" });
      }
    } catch (err) {
      console.log("Error adding like:", err);
      return res.status(500).json({ error: true, msg: err });
    }
  };

  // Unlike book review
  unlikeBookReview = async (req, res) => {
    const { reviewId } = req.params;
    const { userId } = req.body;

    try {
      const user = await this.userModel.findByPk(userId);
      const bookReview = await this.model.findByPk(reviewId);

      if (user && bookReview) {
        // Log activity
        try {
          await this.activityModel.create({
            userId,
            activityType: "unliked",
            targetId: reviewId,
            targetType: "review",
          });
        } catch (activityError) {
          console.log("Failed to log activity:", activityError);
        }
        await user.removeLikedReviews(bookReview);
        return res.json({ success: true, msg: "Successfully unliked review" });
      } else {
        return res
          .status(404)
          .json({ error: true, msg: "User or review not found" });
      }
    } catch (err) {
      console.log("Error removing like:", err);
      return res.status(500).json({ error: true, msg: err });
    }
  };

  // Count number of reviews liked by user
  countLikedBookReviews = async (req, res) => {
    const { userId } = req.params;

    try {
      const user = await this.userModel.findByPk(userId);
      const count = await user.countLikedReviews();
      return res.json({ count });
    } catch (err) {
      console.log("Error counting reviews liked by user");
      return res.status(500).json({ error: true, msg: err });
    }
  };
}

module.exports = ReviewsController;
