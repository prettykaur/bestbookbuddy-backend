"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("discussions", "body", {
      allowNull: false,
      type: Sequelize.TEXT,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("discussions", "body", {
      allowNull: false,
      type: Sequelize.STRING,
    });
  },
};
