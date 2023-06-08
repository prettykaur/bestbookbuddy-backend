"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Collection extends Model {
    static associate(models) {
      this.belongsTo(models.user, { foreignKey: "user_id" });
      this.belongsToMany(models.book, {
        through: "collection_books",
        foreignKey: "collection_id",
      });
    }
  }
  Collection.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        field: "user_id",
        references: {
          model: "user",
          key: "id",
        },
      },
      name: {
        type: DataTypes.STRING,
        field: "name",
      },
      description: {
        type: DataTypes.STRING,
        field: "description",
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
      modelName: "collection",
      underscored: true,
      timestamps: true,
    }
  );
  return Collection;
};
