const { sequelize } = require("../db/models");
const BaseController = require("./baseController");
const { Op } = require("sequelize");

class ActivitiesController extends BaseController {
  constructor(
    model,
    userModel,
    bookModel,
    bookReviewModel,
    userBookModel,
    collectionModel,
    discussionModel
  ) {
    super(model);
    this.userModel = userModel;
    this.bookModel = bookModel;
    this.bookReviewModel = bookReviewModel;
    this.userBookModel = userBookModel;
    this.collectionModel = collectionModel;
    this.discussionModel = discussionModel;
  }

  // Get user feed
  getFeedForUser = async (req, res) => {
    const { userId } = req.params;
    let { page, limit } = req.query;

    // Set default values for page and limit
    page = isNaN(page) || page <= 0 ? 1 : parseInt(page); // Default to page 1
    limit = isNaN(limit) || limit <= 0 ? 10 : parseInt(limit); // Default to 10 items per page

    // Calculate offset
    const offset = (page - 1) * limit;

    try {
      // Fetch the user
      const user = await this.userModel.findByPk(userId);

      // Fetch friends of user
      const user1Friends = await user.getUser1Friends();
      const user2Friends = await user.getUser2Friends();

      const allFriends = [...user1Friends, ...user2Friends];

      console.log(this.userModel);
      console.log(this.model);
      console.log(Object.keys(this.userModel.associations));
      console.log(Object.keys(this.model.associations));
      console.log(sequelize.models);

      // Get IDs of friends
      const friendIds = allFriends.map((friend) => friend.id);

      // Fetch activities of user and friends
      const activities = await this.model.findAll({
        where: { user_id: { [Op.in]: friendIds } },
        order: [["createdAt", "DESC"]],
        limit: limit,
        offset: offset,
        include: [
          {
            model: this.userModel,
            attributes: ["id", "username", "email", "photoUrl", "lastLogin"],
          },
        ],
      });

      if (activities.length === 0) {
        return res
          .status(404)
          .json({ error: true, msg: "No activities found" });
      }

      // Fetch additional data based on activity type
      const activitiesWithDetails = await Promise.all(
        activities.map(async (activity) => {
          let targetDetails = {};

          switch (activity.targetType) {
            case "review": {
              const review = await this.bookReviewModel.findOne(
                { where: { id: activity.targetId } },
                {
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
                }
              );

              if (!review) {
                console.log(`No review found with id ${activity.targetId}`);
                targetDetails = {
                  error: `This activity refers to a review that no longer exists`,
                };
                break;
              }

              targetDetails = review;
              break;
            }
            case "collection": {
              const collection = await this.collectionModel.findOne(
                { where: { id: activity.targetId } },
                {
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
                }
              );

              if (!collection) {
                console.log(`No collection found with id ${activity.targetId}`);
                targetDetails = {
                  error: `This activity refers to a collection that no longer exists`,
                };
                break;
              }

              targetDetails = collection;
              break;
            }
            case "collectionbook": {
              const collectionBook =
                await sequelize.models.collection_books.findByPk(
                  activity.targetId
                );

              if (!collectionBook) {
                console.log(
                  `No book in collection found with id ${activity.targetId}`
                );
                targetDetails = {
                  error: `This activity refers to a book that was removed from ${user.username}'s collection`,
                };
                break;
              }

              const collection = await this.collectionModel.findByPk(
                collectionBook.collectionId
              );

              if (!collection) {
                console.log(
                  `No book in collection found with id ${collectionBook.collectionId}`
                );
                targetDetails = {
                  error: `This activity refers to a collection that no longer exists`,
                };
                break;
              }

              const book = await this.bookModel.findByPk(collectionBook.bookId);

              if (!book) {
                console.log(
                  `No book in collection found with id ${collectionBook.bookId}`
                );
                targetDetails = {
                  error: `This activity refers to a book that was removed from ${user.username}'s collection`,
                };
                break;
              }

              targetDetails = { collection, book };
              break;
            }
            case "library": {
              const bookInLibrary = await this.userBookModel.findOne(
                { where: { id: activity.targetId } },
                {
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
                }
              );

              if (!bookInLibrary) {
                console.log(
                  `No book in library found with id ${activity.targetId}`
                );
                targetDetails = {
                  error: `This activity refers to a book that was removed from ${user.username}'s library`,
                };
                break;
              }

              targetDetails = bookInLibrary;
              break;
            }
            case "discussion": {
              const discussion = await this.discussionModel.findOne({
                where: { id: activity.targetId, parentId: null },
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
                    model: this.discussionModel,
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

              if (!discussion) {
                console.log(
                  `No discussion thread found with id ${activity.targetId}`
                );
                targetDetails = {
                  error: `This activity refers to a discussion thread that no longer exists`,
                };
                break;
              }

              targetDetails = discussion;
              break;
            }
            case "comment": {
              const comment = await this.discussionModel.findOne(
                {
                  where: { id: activity.targetId, parentId: { [Op.ne]: null } },
                },
                {
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
                      model: this.discussionModel,
                      as: "parentDiscussion",
                      include: [
                        {
                          model: this.userModel,
                          attributes: ["id", "username", "email", "photoUrl"],
                        },
                      ],
                    },
                  ],
                }
              );

              if (!comment) {
                console.log(
                  `No comment in discussion thread found with id ${activity.targetId}`
                );
                targetDetails = {
                  error: `This activity refers to a comment that no longer exists`,
                };
                break;
              }

              targetDetails = comment;
              break;
            }
            case "friend": {
              const friend = await this.userModel.findByPk(activity.targetId);

              if (!friend) {
                console.log(`No friend found with id ${activity.targetId}`);
                targetDetails = {
                  error: `This activity refers to a friend that no longer exists`,
                };
                break;
              }

              targetDetails = friend;
              break;
            }
            default:
              console.log(`Unexpected targetType: ${activity.targetType}`);
              targetDetails = null;
              break;
          }

          activity.targetDetails = targetDetails;
          return { ...activity.get({ plain: true }), targetDetails };
        })
      );

      return res.json(activitiesWithDetails);
    } catch (err) {
      console.log("Error fetching feed:", err);
      return res.status(400).json({ error: true, msg: err.message });
    }
  };
}

module.exports = ActivitiesController;
