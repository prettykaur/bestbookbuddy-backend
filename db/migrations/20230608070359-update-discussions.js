"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("discussions", "parent_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "discussions",
        key: "id",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("discussions", "parent_id", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "discussions",
        key: "id",
      },
    });
  },
};
