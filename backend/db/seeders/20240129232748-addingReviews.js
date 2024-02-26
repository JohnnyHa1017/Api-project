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
          "userId": 3,
          "spotId": 1,
          "review": "The locals are so fun and amazing!",
          "stars": 4,
        },
        {
          "userId": 1,
          "spotId": 2,
          "review": "Food and Entertainment here is INCREDIBLE!",
          "stars": 3,
        },
        {
          "userId": 2,
          "spotId": 3,
          "review": "Expected nothing less from the Avocado Manor!",
          "stars": 5,
        },
        {
          "userId": 1,
          "spotId": 9,
          "review": "The sushi here is literally the best!",
          "stars": 4,
        },
        {
          "userId": 2,
          "spotId": 9,
          "review": "It smells like fish everywhere, wasn't a huge fan.",
          "stars": 2,
        },
        {
          "userId": 3,
          "spotId": 4,
          "review": "This was an awesome spot! Shared space with Elayn but she's a sweetheart!",
          "stars": 5,
        },
        {
          "userId": 3,
          "spotId": 5,
          "review": "This was an awesome find! The Eastern culture is so intriguing!",
          "stars": 3,
        },
        {
          "userId": 1,
          "spotId": 6,
          "review": "The description does NOT lie!! We easily hosted a huge party in the ballroom!",
          "stars": 4,
        },
        {
          "userId": 1,
          "spotId": 7,
          "review": "Ereonnor Falls was so majestic! Incredible!",
          "stars": 5,
        },
        {
          "userId": 1,
          "spotId": 10,
          "review": "Walking distance to the subway and close to local living!!",
          "stars": 4,
        },
      ], { validate: true });
  } catch (err) {
    console.error(err);
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
