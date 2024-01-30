'use strict';

const { ReviewImage } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up (queryInterface, Sequelize) {
    try{
      await ReviewImage.bulkCreate([
        {
          reviewId: 1,
          url: 'https://lh6.googleusercontent.com/-gizvgfgzkFQ/TWsVQptsSTI/AAAAAAAACHo/Pljgh8ZHwuE/s1600/Homes1-4%252C+Fort+Sanders%252C+Knoxville%252C+February+2011.jpg',
        },
        {
          reviewId: 2,
          url: 'https://loveincorporated.blob.core.windows.net/contentimages/gallery/ec5377be-0bdf-444e-9b76-c2a2e52702d3-worlds-weirdest-and-wildest-homes-for-sale-right-now-barbie-house-ext.jpg',
        },
        {
          reviewId: 3,
          url: 'https://images.estately.net/165_202322122_0_1691179092_636x435.jpg',
        },
      ], { validate: true });
  } catch (err) {
    console.log(err);
    throw err;
  }
  },
  async down (queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      reviewId: { [Op.in]: [1, 2, 3] },
    }, {});
  }
};
