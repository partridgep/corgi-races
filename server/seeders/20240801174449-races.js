'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('races', [
      {
        datetime: '2024-07-13 14:00:00-05',
        address: '5505 Ann Arbor Saline Road',
        city: 'Ann Arbor',
        state: 'MI',
        info_url: 'https://www.mi-celtic.org/corgi-races',
      },
      {
        datetime: '2024-07-14 13:30:00-07',
        address: 'Emerald Downs 2300 Ron Crockett Drive',
        city: 'Auburn',
        state: 'WA',
        info_url: 'https://emeralddowns.com/event/corgi-world-championship-races/'
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('races', null, {});
  }
};
