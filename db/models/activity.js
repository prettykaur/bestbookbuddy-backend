"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Activity extends Model {
    static associate(models) {
      this.belongsTo(models.user, { foreignKey: "user_id" });
    }
  }
  Activity.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        field: "user_id",
        references: {
          model: "user",
          key: "id",
        },
      },
      activityType: {
        type: DataTypes.STRING,
        field: "activity_type",
      },
      targetId: {
        type: DataTypes.INTEGER,
        field: "target_id",
      },
      targetType: {
        type: DataTypes.STRING,
        field: "target_type",
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
      modelName: "activity",
      tableName: "activities",
      underscored: true,
      timestamps: true,
    }
  );
  return Activity;
};
