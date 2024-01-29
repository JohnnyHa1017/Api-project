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
          startDate: '2024-01-26',
          endDate: '2024-02-07'
        },
        {
          spotId: 2,
          userId: 3,
          startDate: '2024-02-26',
          endDate: '2024-03-07'
        },
        {
          spotId: 3,
          userId: 2,
          startDate: '2024-03-26',
          endDate: '2024-04-07'
        },
        {
          spotId: 3,
          userId: 2,
          startDate: '2024-03-26',
          endDate: '2024-04-07'
        },
      ], { validate: true });
  } catch (err) {
    console.log(err);
    throw err;
  }
  },
  async down(queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return Booking.destroy({
      where: {
        spotId: { [Op.in]: [1, 2, 3] }
      }
    });
  }
};
