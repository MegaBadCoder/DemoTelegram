'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'createdAt', {
      type: Sequelize.DATE,
      allowNull: false,
    })
    await queryInterface.addColumn('users', 'updatedAt', {
      type: Sequelize.DATE,
      allowNull: false,
    })
    await queryInterface.addColumn('users', 'chatId', {
      type: Sequelize.INTEGER,
      allowNull: false,
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'createdAt');
    await queryInterface.removeColumn('Users', 'updatedAt');
  }
};
