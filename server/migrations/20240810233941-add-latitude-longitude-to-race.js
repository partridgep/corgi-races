'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('races', 'latitude', {
      type: Sequelize.FLOAT,
      allowNull: true, // Allow null initially
    });
    await queryInterface.addColumn('races', 'longitude', {
      type: Sequelize.FLOAT,
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('races', 'latitude');
    await queryInterface.removeColumn('races', 'longitude');
  }
};
