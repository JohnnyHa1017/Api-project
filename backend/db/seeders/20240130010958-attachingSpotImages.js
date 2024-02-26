'use strict';

const { SpotImage } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up (queryInterface, Sequelize) {
    try{
      await SpotImage.bulkCreate([
        {
          spotId: 1,
          url: "https://i.postimg.cc/j2vnHB1P/Selfie-20240220-Boxerrr-001.jpg",
          preview: true,
        },
        {
          spotId: 1,
          url: "https://i.postimg.cc/jS1Nk0Sh/Selfie-20240220-Boxerrr-002.jpg",
          preview: false,
        },
        {
          spotId: 1,
          url: "https://i.postimg.cc/mDYHDPNd/Selfie-20240220-Boxerrr-003.jpg",
          preview: false,
        },
        {
          spotId: 1,
          url: "https://i.postimg.cc/C1T8SGDB/Selfie-20240220-Boxerrr-004.jpg",
          preview: false,
        },
        {
          spotId: 1,
          url: "https://i.postimg.cc/R0ntks3x/Selfie-20240220-Boxerrr-005.jpg",
          preview: false,
        },
        {
          spotId: 2,
          url: "https://i.postimg.cc/s2SB6M8V/Selfie-20240220-Havocados-000.jpg",
          preview: true,
        },
        {
          spotId: 2,
          url: "https://i.postimg.cc/XYtGkfsH/Selfie-20240220-Havocados-001.jpg",
          preview: false,
        },
        {
          spotId: 2,
          url: "https://i.postimg.cc/wvQ1zSgZ/Selfie-20240220-Havocados-002.jpg",
          preview: false,
        },
        {
          spotId: 2,
          url: "https://i.postimg.cc/ZnYC5VqR/Selfie-20240220-Havocados-003.jpg",
          preview: false,
        },
        {
          spotId: 2,
          url: "https://i.postimg.cc/rmkDv8X5/Selfie-20240220-Havocados-004.jpg",
          preview: false,
        },
        {
          spotId: 3,
          url: "https://i.postimg.cc/Kjmggm0m/Selfie-20240220-Havocado-000.jpg",
          preview: true,
        },
        {
          spotId: 3,
          url:"https://i.postimg.cc/h40mR7Gv/Selfie-20240220-Havocado-001.jpg",
          preview: false,
        },
        {
          spotId: 3,
          url:"https://i.postimg.cc/qMM3JMtL/Selfie-20240220-Havocado-002.jpg",
          preview: false,
        },
        {
          spotId: 3,
          url:"https://i.postimg.cc/g2xLhSHL/Selfie-20240220-Havocado-003.jpg",
          preview: false,
        },
        {
          spotId: 3,
          url:"https://i.postimg.cc/dtHTLPrK/Selfie-20240220-Havocado-004.jpg",
          preview: false,
        },
        {
          spotId: 4,
          url: "https://i.postimg.cc/Wz9tFgD7/Selfie-20240220-Havoo-000.jpg",
          preview: true,
        },
        {
          spotId: 4,
          url: "https://i.postimg.cc/MZtnF2sj/Selfie-20240220-Havoo-001.jpg",
          preview: false,
        },
        {
          spotId: 4,
          url: "https://i.postimg.cc/nczX8R5S/Selfie-20240220-Havoo-002.jpg",
          preview: false,
        },
        {
          spotId: 4,
          url: "https://i.postimg.cc/wjR3Mt9h/Selfie-20240220-Havoo-003.jpg",
          preview: false,
        },
        {
          spotId: 4,
          url: "https://i.postimg.cc/jjz56Gw2/Selfie-20240220-Havoo-004.jpg",
          preview: false,
        },
        {
          spotId: 5,
          url: "https://i.postimg.cc/fTrJM7Qz/Selfie-20240220-Paxmichelin-000.jpg",
          preview: true,
        },
        {
          spotId: 5,
          url: "https://i.postimg.cc/43Cy9J3j/Selfie-20240220-Paxmichelin-001.jpg",
          preview: false,
        },
        {
          spotId: 5,
          url: "https://i.postimg.cc/JnMhpPZq/Selfie-20240220-Paxmichelin-002.jpg",
          preview: false,
        },
        {
          spotId: 5,
          url: "https://i.postimg.cc/xC51hMPS/Selfie-20240220-Paxmichelin-003.jpg",
          preview: false,
        },
        {
          spotId: 5,
          url: "https://i.postimg.cc/qq7vTqm6/Selfie-20240220-Paxmichelin-004.jpg",
          preview: false,
        },
        {
          spotId: 6,
          url: "https://i.postimg.cc/fLw5jvNr/Selfie-20240226-Joxha-000.jpg",
          preview: true,
        },
        {
          spotId: 6,
          url: "https://i.postimg.cc/GhZQSRRY/Selfie-20240226-Joxha-001.jpg",
          preview: false,
        },
        {
          spotId: 6,
          url: "https://i.postimg.cc/x88RBTqG/Selfie-20240226-Joxha-002.jpg",
          preview: false,
        },
        {
          spotId: 6,
          url: "https://i.postimg.cc/gJNsM6ck/Selfie-20240226-Joxha-003.jpg",
          preview: false,
        },
        {
          spotId: 6,
          url: "https://i.postimg.cc/15gBHtks/Selfie-20240226-Joxha-004.jpg",
          preview: false,
        },
        {
          spotId: 7,
          url: "https://i.postimg.cc/tgFmzTVY/Selfie-20240226-Havocado-000.jpg",
          preview: true,
        },
        {
          spotId: 7,
          url: "https://i.postimg.cc/6p2PyzWV/Selfie-20240226-Havocado-001.jpg",
          preview: false,
        },
        {
          spotId: 7,
          url: "https://i.postimg.cc/13kj66Xk/Selfie-20240226-Havocado-002.jpg",
          preview: false,
        },
        {
          spotId: 7,
          url: "https://i.postimg.cc/ZnsfqvXD/Selfie-20240226-Havocado-003.jpg",
          preview: false,
        },
        {
          spotId: 7,
          url: "https://i.postimg.cc/59sKgDjq/Selfie-20240226-Havocado-004.jpg",
          preview: false,
        },
        {
          spotId: 8,
          url: "https://i.postimg.cc/7hRV48TF/Selfie-20240226-Joxha-004-0.jpg",
          preview: true,
        },
        {
          spotId: 8,
          url: "https://i.postimg.cc/c1kTwY5F/Selfie-20240226-Joxha-004-1.jpg",
          preview: false,
        },
        {
          spotId: 8,
          url: "https://i.postimg.cc/5tJmbm62/Selfie-20240226-Joxha-004-2.jpg",
          preview: false,
        },
        {
          spotId: 8,
          url: "https://i.postimg.cc/DzcPZbXd/Selfie-20240226-Joxha-004-3.jpg",
          preview: false,
        },
        {
          spotId: 8,
          url: "https://i.postimg.cc/9M8PP51D/Selfie-20240226-Joxha-004-4.jpg",
          preview: false,
        },
        {
          spotId: 9,
          url: "https://i.postimg.cc/YqVnKg6v/Selfie-20240226-Havoo-000.jpg",
          preview: true,
        },
        {
          spotId: 9,
          url: "https://i.postimg.cc/JzkT1nxP/Selfie-20240226-Havoo-001.jpg",
          preview: false,
        },
        {
          spotId: 9,
          url: "https://i.postimg.cc/NfLJzbHh/Selfie-20240226-Havoo-002.jpg",
          preview: false,
        },
        {
          spotId: 9,
          url: "https://i.postimg.cc/bvfmdhF8/Selfie-20240226-Havoo-003.jpg",
          preview: false,
        },
        {
          spotId: 9,
          url: "https://i.postimg.cc/GpPqy5ZD/Selfie-20240226-Havoo-004.jpg",
          preview: false,
        },
        {
          spotId: 10,
          url: "https://i.postimg.cc/QxMwrhvy/Selfie-20240226-Boxerrr-000.jpg",
          preview: true,
        },
        {
          spotId: 10,
          url: "https://i.postimg.cc/KzFpp2nQ/Selfie-20240226-Boxerrr-001.jpg",
          preview: false,
        },
        {
          spotId: 10,
          url: "https://i.postimg.cc/1RB2Tf7F/Selfie-20240226-Boxerrr-002.jpg",
          preview: false,
        },
        {
          spotId: 10,
          url: "https://i.postimg.cc/L58CR3Q1/Selfie-20240226-Boxerrr-003.jpg",
          preview: false,
        },
        {
          spotId: 10,
          url: "https://i.postimg.cc/KzNqdHfb/Selfie-20240226-Boxerrr-004.jpg",
          preview: false,
        },
      ], { validate: true });
  } catch (err) {
    console.error(err);
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
