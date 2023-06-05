"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Discussion extends Model {
    static associate(models) {
      this.belongsTo(models.user, { foreignKey: "user_id" });
      this.belongsTo(models.book, { foreignKey: "book_id" });

      // Self-referential association
      this.hasMany(models.discussion, { foreignKey: "parent_id" });
      this.belongsTo(models.discussion, { foreignKey: "parent_id" });

      this.belongsToMany(models.user, {
        through: "user_discussions",
        foreignKey: "discussion_id",
      });
    }
  }
  Discussion.init(
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
      title: {
        type: DataTypes.STRING,
        field: "title",
      },
      body: {
        type: DataTypes.STRING,
        field: "body",
      },
      parentId: {
        type: DataTypes.INTEGER,
        field: "parent_id",
        references: {
          model: "discussion",
          key: "id",
        },
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
      modelName: "discussion",
      underscored: true,
      timestamps: true,
    }
  );
  return Discussion;
};
