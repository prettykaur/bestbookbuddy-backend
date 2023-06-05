"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("collection_books", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      collection_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "collections",
          key: "id",
        },
      },
      book_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "books",
          key: "id",
        },
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("collection_books");
  },
};
