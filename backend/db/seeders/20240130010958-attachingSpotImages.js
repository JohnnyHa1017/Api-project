'use strict';

/** @type {import('sequelize-cli').Migration} */
const { SpotImage } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}
module.exports = {
  async up (queryInterface, Sequelize) {
    try{
      await SpotImage.bulkCreate([
        {
          spotId: 1,
          url: 'https://www.thetinylife.com/wp-content/uploads/2012/02/cob-cottage.jpg',
          preview: true
        },
        {
          spotId: 2,
          url: 'https://theonlinephotographer.typepad.com/.a/6a00df351e888f8834019b0149ba30970d-800wi',
          preview: true
        },
        {
          spotId: 3,
          url: 'https://i.pinimg.com/736x/2d/b7/67/2db767edbdbb7279036af098d56897c7.jpg',
          preview: true
        },
      ], { validate: true });
  } catch (err) {
    console.log(err);
    throw err;
  }
  },
  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      preview: { [Op.in]: [true] },
    }, {});
  }
};
