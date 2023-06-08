"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("discussions", "title", {
      allowNull: true,
      type: Sequelize.STRING,
    });
    await queryInterface.changeColumn("discussions", "parent_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.addConstraint("discussions", {
      fields: ["parent_id"],
      type: "foreign key",
      name: "discussions_parent_id_fkey",
      references: {
        table: "discussions",
        field: "id",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint(
      "discussions",
      "discussions_parent_id_fkey"
    );
    await queryInterface.changeColumn("discussions", "parent_id", {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
    await queryInterface.changeColumn("discussions", "title", {
      allowNull: false,
      type: Sequelize.STRING,
    });
  },
};
