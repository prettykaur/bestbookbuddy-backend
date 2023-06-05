"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "friend_request_status",
      [
        {
          status: "Pending",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          status: "Accepted",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          status: "Rejected",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("friend_request_status", null, {});
  },
};
