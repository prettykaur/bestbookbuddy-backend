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
      isbn: {
        type: DataTypes.STRING,
        field: "isbn",
      },
      authors: {
        type: DataTypes.STRING,
        field: "authors",
      },
      publicationDate: {
        type: DataTypes.STRING,
        field: "publication_date",
      },
      averageRating: {
        type: DataTypes.DECIMAL(10, 2),
        field: "average_rating",
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
