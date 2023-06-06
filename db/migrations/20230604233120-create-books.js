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
      ol_edition_key: {
        unique: true,
        type: Sequelize.STRING,
      },
      ol_edition_count: {
        unique: true,
        type: Sequelize.INTEGER,
      },
      isbn_10: {
        unique: true,
        type: Sequelize.INTEGER,
      },
      isbn_13: {
        unique: true,
        type: Sequelize.INTEGER,
      },
      ol_cover_id: {
        unique: true,
        type: Sequelize.INTEGER,
      },
      ol_ratings_count: {
        type: Sequelize.INTEGER,
      },
      ol_ratings_average: {
        type: Sequelize.FLOAT,
      },
      users_ratings_average: {
        type: Sequelize.FLOAT,
      },
      ol_author_key: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      author_name: {
        allowNull: false,
        type: Sequelize.STRING,
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
