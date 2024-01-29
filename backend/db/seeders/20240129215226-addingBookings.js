'use strict';

/** @type {import('sequelize-cli').Migration} */

const { Booking } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up (queryInterface, Sequelize) {
    try{
      await Booking.bulkCreate([
        {
          spotId: 1,
          userId: 1,
          startDate: '01-26-2024',
          endDate: '02-07-2024'
        },
        {
          spotId: 2,
          userId: 3,
          startDate: '02-26-2024',
          endDate: '03-07-2024'
        },
        {
          spotId: 3,
          userId: 2,
          startDate: '03-26-2024',
          endDate: '04-07-2024'
        },
      ], { validate: true });
  } catch (err) {
    console.log(err);
    throw err;
  }
  },
    async down (queryInterface, Sequelize) {
      options.tableName = 'Bookings';
      const Op = Sequelize.Op;
      return queryInterface.bulkDelete(options, {
        spotId: { [Op.in]: [ 1, 2, 3 ] }
      }, {});
    }
  };

