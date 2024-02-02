const express = require("express");
const { Sequelize } = require("sequelize");
const { Op } = require("sequelize");
const { requireAuth } = require("../../utils/auth");
const { Spot, Review, User, SpotImage, ReviewImage, Booking } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

const validateBooking = [
  check('spotId')
    .isInt()
    .exists({ checkFalsy: true })
    .withMessage('Spot ID must be an integer'),
  check('userId')
    .isInt()
    .exists({ checkFalsy: true })
    .withMessage('User ID must be an integer'),
  check('startDate')
    .isDate()
    .exists({ checkFalsy: true })
    .withMessage('Invalid start date'),
  check('endDate')
    .isDate()
    .exists({ checkFalsy: true })
    .withMessage('Invalid end date'),
  handleValidationErrors
];

const fetchUserBookings = async (req, res, next) => {
  const allSpots = await Spot.findAll();
  const detailedSpot = await Promise.all(allSpots.map(async (spot) => {
  const previewImages = await SpotImage.findAll({
    where: {
      spotId: spot.id,
    },
       attributes: ["url"],
    });

    let imageSearch;

    if (previewImages.length > 0) {
      imageSearch = previewImages.find(image => image.url).dataValues.url;
    } else {
      imageSearch = null;
    }

    return {
      id: spot.id,
      ownerId: spot.ownerId,
      address: spot.address,
      city: spot.city,
      state: spot.state,
      country: spot.country,
      lat: spot.lat,
      lng: spot.lng,
      name: spot.name,
      price: spot.price,
      previewImage: imageSearch,
    };
  }));

    const userBookings = await Booking.findAll({
      where: {
        userId: req.user.id
      },
      include: [{
          model: Spot,
          detailedSpot
        }],
      startDate: Booking.startDate,
      endDate: Booking.endDate,
      createdAt: Booking.createdAt,
      updatedAt: Booking.updatedAt
    });
    
    req.userBookings = userBookings;
    next();
  };

  router.get('/current', requireAuth, fetchUserBookings, (req, res) => {
    const { userBookings } = req;
    res.status(200).json({ Bookings: userBookings });
  });

module.exports = router;
