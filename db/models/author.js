"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Author extends Model {
    static associate(models) {
      this.hasMany(models.book, { foreignKey: "author_id" });
    }
  }
  Author.init(
    {
      name: {
        type: DataTypes.STRING,
        field: "name",
      },
      bio: {
        type: DataTypes.STRING,
        field: "bio",
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
      modelName: "author",
      underscored: true,
      timestamps: true,
    }
  );
  return Author;
};
