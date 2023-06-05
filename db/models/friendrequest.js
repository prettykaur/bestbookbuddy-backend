"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class FriendRequest extends Model {
    static associate(models) {
      this.belongsTo(models.user, { foreignKey: "sender_id", as: "sender" });
      this.belongsTo(models.user, {
        foreignKey: "recipient_id",
        as: "recipient",
      });
      this.belongsTo(models.friendrequeststatus, {
        foreignKey: "status_id",
        as: "status",
      });
    }
  }
  FriendRequest.init(
    {
      senderId: {
        type: DataTypes.INTEGER,
        field: "sender_id",
        references: {
          model: "user",
          key: "id",
        },
      },
      recipientId: {
        type: DataTypes.INTEGER,
        field: "recipient_id",
        references: {
          model: "user",
          key: "id",
        },
      },
      statusId: {
        type: DataTypes.INTEGER,
        field: "status_id",
        references: {
          model: "friendrequeststatus",
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
      modelName: "friendrequest",
      tableName: "friend_requests",
      underscored: true,
      timestamps: true,
    }
  );
  return FriendRequest;
};
