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
    await Spot.bulkCreate([
      {
        ownerId: 1,
        address: '923 S. Island Festival',
        city:'Nia Village',
        state:'Punika',
        country:'Arkesia',
        lat:-34.343432,
        lng:-120.343432,
        name: 'Island Resort Getaway',
        description:'Come dance with the locals and forget all your worries!',
        price:899.00
      },
      {
        ownerId:2,
        address: '1226 E. Luterra Cs.',
        city:'Luterra',
        state:'Rethmartis',
        country:'Arkesia',
        lat:42.34325346,
        lng:150.33342423,
        name: 'Castle of your Dreams',
        description:'Beautiful castle built in the countryside with plenty of local attractions!',
        price:729.00
      },
      {
        ownerId:3,
        address: '1 Avocado Way',
        city:'Stronghold',
        state:'Avocounty',
        country:'Arkesia',
        lat: 12.35435,
        lng:145.3432343,
        name: "Avocado Manor",
        description:'EXTREMELY RARE FIND: Come gather with all characters of Arkesia, has a local bazaar and social circle.',
        price:9999.99
      },
      {
        ownerId: 1,
        address:'2424 N. Vern Cs.',
        city:'Vern Castle',
        state: 'Vern',
        country: 'Arkesia',
        lat:54.23156,
        lng:-23.1232,
        name: 'Stay with Elayn',
        description: 'Bright and Inviting feel and aesthetics at the wonderful castle that Elayn has called home, come expeience Royal Living with Elayn today!',
        price: 699.00
      },
      {
        ownerId: 2,
        address: '888 Changhun Way',
        city:'Port City',
        state:'Anikka',
        country:'Arkesia',
        lat:10.234356,
        lng:-62.34235,
        name:'Port City Changhun',
        description: 'A fairytale home with an Eastern flare, come visit Port City Changhun with plenty of local tourist attractions!',
        price: 888.88
      }
    ], { validate: true });
},
  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['Island Resort Getaway', 'Castle of your Dreams', "Avocado Manor", 'Stay with Elayn', 'Port City Changhun'] }
    }, {});
  }
};
