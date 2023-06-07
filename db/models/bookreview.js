"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class BookReview extends Model {
    static associate(models) {
      this.belongsTo(models.user, { foreignKey: "user_id" });
      this.belongsTo(models.book, { foreignKey: "book_id" });

      this.belongsToMany(models.user, {
        through: "book_review_likes",
        foreignKey: "review_id",
        as: "likedBy",
      });
    }
  }
  BookReview.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        field: "user_id",
        references: {
          model: "user",
          key: "id",
        },
      },
      bookId: {
        type: DataTypes.INTEGER,
        field: "book_id",
        references: {
          model: "book",
          key: "id",
        },
      },
      rating: {
        type: DataTypes.INTEGER,
        field: "rating",
      },
      body: {
        type: DataTypes.STRING,
        field: "body",
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "created_at",
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "updated_at",
      },
    },
    {
      sequelize,
      modelName: "bookreview",
      tableName: "book_reviews",
      underscored: true,
      timestamps: true,
    }
  );
  return BookReview;
};
