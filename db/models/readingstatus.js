"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ReadingStatus extends Model {
    static associate(models) {
      this.hasMany(models.userbook, { foreignKey: "status_id" });
    }
  }
  ReadingStatus.init(
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
      modelName: "readingstatus",
      tableName: "reading_status",
      underscored: true,
      timestamps: true,
    }
  );
  return ReadingStatus;
};
