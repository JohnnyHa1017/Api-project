'use strict';

const { User } = require("../models");
const { Spot } = require("../models");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up (queryInterface, Sequelize) {
  try{
    await Spot.bulkCreate([
      {
        ownerId: 1,
        address: '123 Disney Lane',
        city: 'San Francisco',
        state: 'California',
        country: 'United States',
        lat: 37.7645358,
        lng: -122.4730327,
        name: 'App Academy',
        description: 'Place where web developers are created',
        price: 123.00,
      },
      {
        ownerId: 2,
        address: '132 Walt Disney Lane',
        city: 'Queens',
        state: 'New York',
        country: 'United States',
        lat: 58.3458732,
        lng: 122.4732703,
        name: 'American Dream',
        description: 'Place where your dreams are created',
        price: 256.98,
      },
      {
        ownerId: 3,
        address: '146 Ditney Ave',
        city: 'Dallas',
        state: 'Texas',
        country: 'United States',
        lat: 37.7645358,
        lng: 58.3458732,
        name: 'Texas Toast',
        description: 'Feel nice and toasty from home',
        price: 231.68,
      },
    ], { validate: true });
} catch (err) {
  console.log(err);
  throw err;
}
},
  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['App Academy', 'American Dream', 'Texas Toast'] }
    }, {});
  }
};
