"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "reading_status",
      [
        {
          status: "to-read",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          status: "reading",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          status: "read",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          status: "dnf",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("reading_status", null, {});
  },
};
