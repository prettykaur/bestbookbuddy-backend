const BaseController = require("./baseController");
const { Op } = require("sequelize");

class DiscussionsController extends BaseController {
  constructor(model, bookModel, userModel, activityModel) {
    super(model);
    this.bookModel = bookModel;
    this.userModel = userModel;
    this.activityModel = activityModel;
  }

  // Get list of all discussions
  getAllDiscussions = async (req, res) => {
    try {
      const discussions = await this.model.findAll({
        include: [
          {
            model: this.userModel,
            attributes: ["id", "username", "email", "photoUrl"],
          },
          {
            model: this.bookModel,
            attributes: ["id", "title", "olCoverId", "authorName"],
          },
        ],
      });

      return res.json(discussions);
    } catch (err) {
      console.log("Error getting discussions:", err);
      return res.status(500).json({ error: true, msg: err.message });
    }
  };

  // Get list of discussions created by user
  getDiscussionsByUser = async (req, res) => {
    const { userId } = req.params;

    try {
      const discussions = await this.model.findAll({
        where: {
          userId,
          parentId: null,
        },
        include: [
          {
            model: this.userModel,
            attributes: ["id", "username", "email", "photoUrl"],
          },
          {
            model: this.bookModel,
            attributes: ["id", "title", "olCoverId", "authorName"],
          },
          {
            model: this.model,
            as: "children",
            attributes: ["id", "body"],
          },
        ],
      });

      return res.json(discussions);
    } catch (err) {
      console.log("Error getting discussions created by user:", err);
      return res.status(500).json({ error: true, msg: err.message });
    }
  };

  // Get list of discussions commented on by user
  getCommentsByUser = async (req, res) => {
    const { userId } = req.params;

    try {
      const comments = await this.model.findAll({
        where: {
          userId,
          parentId: {
            [Op.ne]: null,
          },
        },
        include: [
          {
            model: this.userModel,
            attributes: ["id", "username", "email", "photoUrl"],
          },
          {
            model: this.bookModel,
            attributes: ["id", "title", "olCoverId", "authorName"],
          },
          {
            model: this.model,
            as: "parentDiscussion",
            attributes: ["id", "title", "body"],
          },
        ],
      });

      return res.json(comments);
    } catch (err) {
      console.log("Error getting comments by user:", err);
      return res.status(500).json({ error: true, msg: err.message });
    }
  };

  // Get info on specific discussion
  getDiscussion = async (req, res) => {
    const { discussionId } = req.params;

    try {
      const discussion = await this.model.findOne({
        where: { id: discussionId },
        include: [
          {
            model: this.userModel,
            attributes: ["id", "username", "email", "photoUrl"],
          },
          {
            model: this.bookModel,
            attributes: ["id", "title", "olCoverId", "authorName"],
          },
          {
            model: this.model,
            as: "children",
            separate: true,
            where: {
              parentId: discussionId,
            },
            include: [
              {
                model: this.userModel,
                attributes: ["id", "username", "email", "photoUrl"],
              },
            ],
          },
        ],
      });

      return res.json(discussion);
    } catch (err) {
      console.log("Error getting discussion:", err);
      return res.status(500).json({ error: true, msg: err.message });
    }
  };

  // Get info on specific comment
  getComment = async (req, res) => {
    const { discussionId, commentId } = req.params;

    try {
      const comment = await this.model.findOne({
        where: { id: commentId, parentId: discussionId },
        include: [
          {
            model: this.userModel,
            attributes: ["id", "username", "email", "photoUrl"],
          },
          {
            model: this.bookModel,
            attributes: ["id", "title", "olCoverId", "authorName"],
          },
          {
            model: this.model,
            as: "parentDiscussion",
            where: {
              id: discussionId,
              parentId: null,
            },
            include: [
              {
                model: this.userModel,
                attributes: ["id", "username", "email", "photoUrl"],
              },
            ],
          },
        ],
      });

      return res.json({ comment });
    } catch (err) {
      console.log("Error getting comment:", err);
      return res.status(500).json({ error: true, msg: err.message });
    }
  };

  // Add new discussion thread
  addDiscussion = async (req, res) => {
    const { bookId } = req.params;
    const { userId, title, body } = req.body;

    try {
      const newDiscussion = await this.model.create({
        userId,
        bookId,
        title,
        body,
        parentId: null,
      });

      // Log activity
      try {
        await this.activityModel.create({
          userId,
          activityType: "created",
          targetId: newDiscussion.id,
          targetType: "discussion",
        });
      } catch (activityError) {
        console.log("Failed to log activity:", activityError);
      }

      const discussionWithAssociations = await this.model.findOne({
        where: { id: newDiscussion.id },
        include: [
          {
            model: this.userModel,
            attributes: ["id", "username", "email", "photoUrl"],
          },
          {
            model: this.bookModel,
            attributes: ["id", "title", "olCoverId", "authorName"],
          },
          {
            model: this.model,
            as: "children",
            include: [
              {
                model: this.userModel,
                attributes: ["id", "username", "email", "photoUrl"],
              },
            ],
          },
        ],
      });

      return res.status(201).json(discussionWithAssociations);
    } catch (err) {
      console.log("Error creating discussion:", err);
      return res.status(500).json({ error: true, msg: err.message });
    }
  };

  // Add comment to existing discussion
  addComment = async (req, res) => {
    const { bookId, discussionId } = req.params;
    const { userId, body } = req.body;

    try {
      const discussion = await this.model.findByPk(discussionId);

      if (!discussion) {
        return res
          .status(404)
          .json({ error: true, msg: "Discussion not found" });
      }

      const newComment = await this.model.create({
        userId,
        bookId,
        body,
        parentId: discussionId,
      });

      // Log activity
      try {
        await this.activityModel.create({
          userId,
          activityType: "created",
          targetId: newComment.id,
          targetType: "comment",
        });
      } catch (activityError) {
        console.log("Failed to log activity:", activityError);
      }

      const commentWithAssociations = await this.model.findOne({
        where: { id: newComment.id },
        include: [
          {
            model: this.userModel,
            attributes: ["id", "username", "email", "photoUrl"],
          },
          {
            model: this.bookModel,
            attributes: ["id", "title", "olCoverId", "authorName"],
          },
          {
            model: this.model,
            as: "parentDiscussion",
            include: [
              {
                model: this.userModel,
                attributes: ["id", "username", "email", "photoUrl"],
              },
            ],
          },
        ],
      });

      return res.status(201).json(commentWithAssociations);
    } catch (err) {
      console.log("Error creating comment:", err);
      return res.status(500).json({ error: true, msg: err.message });
    }
  };

  // Update discussion thread
  updateDiscussion = async (req, res) => {
    const { discussionId } = req.params;
    const { userId, title, body } = req.body;

    try {
      const updatedRows = await this.model.update(
        {
          title,
          body,
        },
        {
          where: { id: discussionId, userId, parentId: null },
        }
      );

      // If discussion doesn't exist or wasn't created by user
      if (updatedRows[0] === 0) {
        return res.status(403).json({ error: true, msg: "Permission denied" });
      }

      // Fetch updated discussion
      const updatedDiscussion = await this.model.findByPk(discussionId);

      // Log activity
      try {
        await this.activityModel.create({
          userId,
          activityType: "updated",
          targetId: discussionId,
          targetType: "discussion",
        });
      } catch (activityError) {
        console.log("Failed to log activity:", activityError);
      }

      const discussionWithAssociations = await this.model.findOne({
        where: { id: updatedDiscussion.id },
        include: [
          {
            model: this.userModel,
            attributes: ["id", "username", "email", "photoUrl"],
          },
          {
            model: this.bookModel,
            attributes: ["id", "title", "olCoverId", "authorName"],
          },
          {
            model: this.model,
            as: "children",
            include: [
              {
                model: this.userModel,
                attributes: ["id", "username", "email", "photoUrl"],
              },
            ],
          },
        ],
      });

      return res.json(discussionWithAssociations);
    } catch (err) {
      console.log("Error updating discussion:", err);
      return res.status(500).json({ error: true, msg: err.message });
    }
  };

  // Update comment
  updateComment = async (req, res) => {
    const { discussionId, commentId } = req.params;
    const { userId, title, body } = req.body;

    try {
      const updatedRows = await this.model.update(
        { title, body },
        {
          where: { id: commentId, userId, parentId: discussionId },
        }
      );

      // Comment doesn't exist or wasn't created by user
      if (updatedRows[0] === 0) {
        return res.status(403).json({ error: true, msg: "Permission denied" });
      }

      // Fetch updated comment
      const updatedComment = await this.model.findByPk(commentId);

      // Log activity
      try {
        await this.activityModel.create({
          userId,
          activityType: "updated",
          targetId: commentId,
          targetType: "comment",
        });
      } catch (activityError) {
        console.log("Failed to log activity:", activityError);
      }

      const commentWithAssociations = await this.model.findOne({
        where: { id: updatedComment.id },
        include: [
          {
            model: this.userModel,
            attributes: ["id", "username", "email", "photoUrl"],
          },
          {
            model: this.bookModel,
            attributes: ["id", "title", "olCoverId", "authorName"],
          },
          {
            model: this.model,
            as: "parentDiscussion",
            include: [
              {
                model: this.userModel,
                attributes: ["id", "username", "email", "photoUrl"],
              },
            ],
          },
        ],
      });

      return res.json(commentWithAssociations);
    } catch (err) {
      console.log("Error updating comment:", err);
      return res.status(500).json({ error: true, msg: err.message });
    }
  };

  // Delete discussion thread
  deleteDiscussion = async (req, res) => {
    const { discussionId } = req.params;
    const { userId } = req.body;

    try {
      const discussion = await this.model.findOne({
        where: { id: discussionId, userId, parentId: null },
      });
      const comments = await this.model.findAll({
        where: { parentId: discussionId },
      });

      if (!discussion) {
        return res
          .status(404)
          .json({ error: true, msg: "Discussion not found" });
      }

      if (!comments) {
        return res.status(404).json({ error: true, msg: "Comments not found" });
      }

      // Log activity before deleting the discussion
      try {
        await this.activityModel.create({
          userId,
          activityType: "deleted",
          targetId: discussionId,
          targetType: "discussion",
        });
      } catch (activityError) {
        console.log("Failed to log activity:", activityError);
      }

      await this.model.destroy({ where: { parentId: discussionId } });

      await this.model.destroy({ where: { id: discussionId, parentId: null } });

      return res.json({ success: true, msg: "Discussion thread deleted" });
    } catch (err) {
      console.log("Error deleting discussion thread:", err);
      return res.status(500).json({ error: true, msg: err.message });
    }
  };

  // Delete comment
  deleteComment = async (req, res) => {
    const { discussionId, commentId } = req.params;
    const { userId } = req.body;

    try {
      const comment = await this.model.findOne({
        where: { id: commentId, userId, parentId: discussionId },
      });

      if (!comment) {
        return res.status(404).json({ error: true, msg: "Comment not found" });
      }

      // Log activity before deleting the comment
      try {
        await this.activityModel.create({
          userId,
          activityType: "deleted",
          targetId: commentId,
          targetType: "comment",
        });
      } catch (activityError) {
        console.log("Failed to log activity:", activityError);
      }

      await this.model.destroy({ where: { id: comment.id } });

      const updatedDiscussion = await this.model.findAll({
        where: { id: discussionId, parentId: null },
        include: [
          {
            model: this.userModel,
            attributes: ["id", "username", "email", "photoUrl"],
          },
          {
            model: this.bookModel,
            attributes: ["id", "title", "olCoverId", "authorName"],
          },
          {
            model: this.model,
            as: "children",
            separate: true,
            where: {
              parentId: discussionId,
            },
            include: [
              {
                model: this.userModel,
                attributes: ["id", "username", "email", "photoUrl"],
              },
            ],
          },
        ],
      });

      return res.json({
        success: true,
        msg: "Comment deleted",
        updatedDiscussion,
      });
    } catch (err) {
      console.log("Error deleting comment:", err);
      return res.status(500).json({ error: true, msg: err.message });
    }
  };

  // Get all users who liked discussion
  getUsersWhoLikedDiscussion = async (req, res) => {
    const { discussionId } = req.params;

    try {
      const discussion = await this.model.findOne({
        where: { id: discussionId },
        include: [
          {
            model: this.userModel,
            through: "user_discussions",
            as: "likingUsers",
            attributes: ["id", "username", "email", "photoUrl"],
          },
        ],
      });

      if (!discussion) {
        return res
          .status(404)
          .json({ error: true, msg: "Discussion not found" });
      }

      return res.json(discussion.likingUsers);
    } catch (err) {
      console.log("Error getting users who liked discussion:", err);
      return res.status(500).json({ error: true, msg: err.message });
    }
  };

  // Count likes for discussion
  countDiscussionLikes = async (req, res) => {
    const { discussionId } = req.params;

    try {
      const discussion = await this.model.findOne({
        where: { id: discussionId },
        include: [
          {
            model: this.userModel,
            through: "user_discussions",
            as: "likingUsers",
          },
        ],
      });

      if (!discussion) {
        return res
          .status(404)
          .json({ error: true, msg: "Discussion not found" });
      }

      return res.json({ likesCount: discussion.likingUsers.length });
    } catch (err) {
      console.log("Error counting likes for discussion:", err);
      return res.status(500).json({ error: true, msg: err.message });
    }
  };

  // Get discussions liked by user
  getDiscussionsLikedByUser = async (req, res) => {
    const { userId } = req.params;

    try {
      const user = await this.userModel.findOne({
        where: { id: userId },
        include: [
          {
            model: this.model,
            through: "user_discussions",
            as: "likedDiscussions",
          },
        ],
      });

      if (!user) {
        return res.json({ error: true, msg: "User not found" });
      }

      return res.json(user.likedDiscussions);
    } catch (err) {
      console.log("Error getting discussions liked by user:", err);
      return res.status(500).json({ error: true, msg: err.message });
    }
  };

  // Count number of discussions liked by user
  countLikedDiscussionsByUser = async (req, res) => {
    const { userId } = req.params;

    try {
      const user = await this.userModel.findOne({
        where: { id: userId },
        include: [
          {
            model: this.model,
            through: "user_discussions",
            as: "likedDiscussions",
          },
        ],
      });

      if (!user) {
        return res.json({ error: true, msg: "User not found" });
      }

      return res.json({ likedDiscussionsCount: user.likedDiscussions.length });
    } catch (err) {
      console.log("Error counting discussions liked by user:", err);
      return res.status(500).json({ error: true, msg: err.message });
    }
  };

  // Like discussion
  likeDiscussion = async (req, res) => {
    const { discussionId } = req.params;
    const { userId } = req.body;

    try {
      const discussion = await this.model.findOne({
        where: { id: discussionId },
        include: [
          {
            model: this.userModel,
            as: "likingUsers",
          },
        ],
      });

      if (!discussion) {
        return res
          .status(404)
          .json({ error: true, msg: "Discussion not found" });
      }

      const user = await this.userModel.findOne({
        where: { id: userId },
      });

      if (!user) {
        return res.status(404).json({ error: true, msg: "User not found" });
      }

      const alreadyLiked = discussion.likingUsers.some(
        (likingUser) => likingUser.id === userId
      );

      if (alreadyLiked) {
        return res
          .status(400)
          .json({ error: true, msg: "User already liked this discussion" });
      }

      await discussion.addLikingUser(user);

      // Log activity
      try {
        await this.activityModel.create({
          userId,
          activityType: "liked",
          targetId: discussionId,
          targetType: "discussion",
        });
      } catch (activityError) {
        console.log("Failed to log activity:", activityError);
      }

      return res.json({
        success: true,
        msg: "Discussion liked successfully",
        discussion,
      });
    } catch (err) {
      console.log("Error liking discussion:", err);
      return res.status(500).json({ error: true, msg: err.message });
    }
  };

  // Unlike discussion
  unlikeDiscussion = async (req, res) => {
    const { discussionId } = req.params;
    const { userId } = req.body;

    try {
      const discussion = await this.model.findOne({
        where: { id: discussionId },
        include: [
          {
            model: this.userModel,
            as: "likingUsers",
          },
        ],
      });

      if (!discussion) {
        return res
          .status(404)
          .json({ error: true, msg: "Discussion not found" });
      }

      const user = await this.userModel.findOne({
        where: { id: userId },
      });

      if (!user) {
        return res.status(404).json({ error: true, msg: "User not found" });
      }

      const alreadyLiked = discussion.likingUsers.some(
        (likingUser) => likingUser.id === userId
      );

      if (!alreadyLiked) {
        return res
          .status(400)
          .json({ error: true, msg: "User has not liked this discussion yet" });
      }

      // Log activity
      try {
        await this.activityModel.create({
          userId,
          activityType: "unliked",
          targetId: discussionId,
          targetType: "discussion",
        });
      } catch (activityError) {
        console.log("Failed to log activity:", activityError);
      }

      await discussion.removeLikingUser(user);

      return res.json({
        success: true,
        msg: "Discussion unliked successfully",
        discussion,
      });
    } catch (err) {
      console.log("Error unliking discussion:", err);
      return res.status(500).json({ error: true, msg: err.message });
    }
  };
}

module.exports = DiscussionsController;
