'use strict';

/** @type {import('sequelize-cli').Migration} */

const { Review } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}
module.exports = {
  async up (queryInterface, Sequelize) {
    try{
      await Review.bulkCreate([
        {
          "userId": 1,
          "spotId": 2,
          "review": "This was an awesome spot!",
          "stars": 5,
        },
        {
          "userId": 2,
          "spotId": 1,
          "review": "This was a awesome!",
          "stars": 3,
        },
        {
          "userId": 3,
          "spotId": 3,
          "review": "Spot was an awesome!",
          "stars": 4,
        },
      ], { validate: true });
  } catch (err) {
    console.log(err);
    throw err;
  }
  },
  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      userId: { [Op.in]: [ 1, 2, 3 ] }
    }, {});
  }
};
