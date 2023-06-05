"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class FriendRequestStatus extends Model {
    static associate(models) {
      this.hasMany(models.friendrequest, {
        foreignKey: "status_id",
        as: "friendRequests",
      });
    }
  }
  FriendRequestStatus.init(
    {
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        field: "status",
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
      modelName: "friendrequeststatus",
      tableName: "friend_request_status",
      underscored: true,
      timestamps: true,
    }
  );
  return FriendRequestStatus;
};
