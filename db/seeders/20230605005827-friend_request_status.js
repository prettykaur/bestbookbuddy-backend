"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "friend_request_status",
      [
        {
          status: "pending",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          status: "accepted",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          status: "rejected",
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
