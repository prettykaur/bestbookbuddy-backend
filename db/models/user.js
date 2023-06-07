"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      this.hasMany(models.bookreview, { foreignKey: "user_id" });
      this.hasMany(models.discussion, { foreignKey: "user_id" });
      this.hasMany(models.collection, { foreignKey: "user_id" });
      this.hasMany(models.userbook, { foreignKey: "user_id" });
      this.hasMany(models.friendrequest, {
        foreignKey: "sender_id",
        as: "senderRequests",
      });
      this.hasMany(models.friendrequest, {
        foreignKey: "recipient_id",
        as: "recipientRequests",
      });
      this.hasMany(models.activity, { foreignKey: "user_id" });
      this.hasMany(models.activity, { foreignKey: "buyer_id" });

      this.belongsToMany(models.bookreview, {
        through: "book_review_likes",
        foreignKey: "user_id",
        as: "likedReviews",
      });
      this.belongsToMany(models.discussion, {
        through: "user_discussions",
        foreignKey: "user_id",
      });
      this.belongsToMany(models.user, {
        through: "friends",
        foreignKey: "user1_id",
        as: "user1Friends",
        otherKey: "user2_id",
      });
      this.belongsToMany(models.user, {
        through: "friends",
        foreignKey: "user2_id",
        as: "user2Friends",
        otherKey: "user1_id",
      });
      this.belongsToMany(models.user, {
        through: "friend_requests",
        foreignKey: "sender_id",
        as: "sentRequests",
        otherKey: "recipient_id",
      });
      this.belongsToMany(models.user, {
        through: "friend_requests",
        foreignKey: "recipient_id",
        as: "receivedRequests",
        otherKey: "sender_id",
      });
    }
  }
  User.init(
    {
      email: {
        type: DataTypes.STRING,
        field: "email",
      },
      username: {
        type: DataTypes.STRING,
        field: "username",
      },
      address: {
        type: DataTypes.STRING,
        field: "address",
      },
      points: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        field: "points",
      },
      bio: {
        type: DataTypes.STRING,
        field: "bio",
      },
      photoUrl: {
        type: DataTypes.STRING,
        field: "photo_url",
      },
      lastLogin: {
        type: DataTypes.DATE,
        field: "last_login",
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
      modelName: "user",
      underscored: true,
      timestamps: true,
    }
  );
  return User;
};
