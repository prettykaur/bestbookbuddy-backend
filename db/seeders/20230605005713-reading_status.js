"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "reading_status",
      [
        {
          status: "To read",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          status: "Reading",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          status: "Read",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          status: "DNF",
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
