"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Friend extends Model {
    static associate(models) {
      this.belongsTo(models.user, { foreignKey: "user1_id", as: "user1" });
      this.belongsTo(models.user, { foreignKey: "user2_id", as: "user2" });
    }
  }
  Friend.init(
    {
      user1Id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "user1_id",
        references: {
          model: "users",
          key: "id",
        },
      },
      user2Id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "user2_id",
        references: {
          model: "users",
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
      modelName: "friend",
      tableName: "friends",
      underscored: true,
      timestamps: true,
    }
  );
  return Friend;
};
