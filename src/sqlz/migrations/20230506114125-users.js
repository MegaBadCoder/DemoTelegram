'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
          type: Sequelize.UUID,
          autoIncrement: true,
          primaryKey: true,
      },
      name: {
          type: new Sequelize.STRING(128),
          allowNull: false,
      },
      email: {
          type: new Sequelize.STRING(128),
          allowNull: true,
      },
      stateId: {
          type: Sequelize.UUID,
          allowNull: false,
      }
  })
  },

  async down (queryInterface, Sequelize) {
    queryInterface.dropTable('AppUsers')
  }
};
