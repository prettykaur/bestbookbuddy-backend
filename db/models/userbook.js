"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserBook extends Model {
    static associate(models) {
      this.belongsTo(models.user, { foreignKey: "user_id" });
      this.belongsTo(models.book, { foreignKey: "book_id" });
      this.belongsTo(models.readingstatus, { foreignKey: "status_id" });
    }
  }
  UserBook.init(
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
      statusId: {
        type: DataTypes.INTEGER,
        field: "status_id",
        references: {
          model: "readingstatus",
          key: "id",
        },
      },
      readDate: {
        type: DataTypes.DATE,
        field: "read_date",
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
      modelName: "userbook",
      underscored: true,
      timestamps: true,
    }
  );
  return UserBook;
};
