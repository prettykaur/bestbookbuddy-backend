"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("books", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      isbn: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING,
      },
      publicationDate: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      average_rating: {
        type: Sequelize.DECIMAL(10, 2),
      },
      author_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "authors",
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
    await queryInterface.dropTable("books");
  },
};
