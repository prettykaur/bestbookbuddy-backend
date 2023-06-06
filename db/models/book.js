"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    static associate(models) {
      this.hasMany(models.bookreview, { foreignKey: "book_id" });
      this.hasMany(models.discussion, { foreignKey: "book_id" });
      this.hasMany(models.userbook, { foreignKey: "book_id" });

      this.belongsToMany(models.collection, {
        through: "collection_books",
        foreignKey: "book_id",
      });
    }
  }
  Book.init(
    {
      title: {
        type: DataTypes.STRING,
        field: "title",
      },
      olEditionKey: {
        type: DataTypes.STRING,
        field: "ol_edition_key",
      },
      olEditionCount: {
        type: DataTypes.INTEGER,
        field: "ol_edition_count",
      },
      isbn10: {
        type: DataTypes.STRING,
        field: "isbn_10",
      },
      isbn13: {
        type: DataTypes.STRING,
        field: "isbn_13",
      },
      olCoverId: {
        type: DataTypes.STRING,
        field: "ol_cover_id",
      },
      olRatingsCount: {
        type: DataTypes.INTEGER,
        field: "ol_ratings_count",
      },
      olRatingsAverage: {
        type: DataTypes.FLOAT,
        field: "ol_ratings_average",
      },
      usersRatingsAverage: {
        type: DataTypes.FLOAT,
        field: "users_ratings_average",
      },
      olAuthorKey: {
        type: DataTypes.STRING,
        field: "ol_author_key",
      },
      authorName: {
        type: DataTypes.STRING,
        field: "author_name",
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
      modelName: "book",
      underscored: true,
      timestamps: true,
    }
  );
  return Book;
};
