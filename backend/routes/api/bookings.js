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

const validDates = [
  check('startDate')
    .exists({ checkFalsy: true })
    .custom((value, { req }) => {
      if (new Date(value) < new Date()) {
        throw new Error("startDate cannot be in the past");
      }
      return true;
    }),
  check('endDate')
    .exists({ checkFalsy: true })
    .custom((value, { req }) => {
      const startDate = new Date(req.body.startDate);
      const endDate = new Date(value);
      if (endDate <= startDate) {
        throw new Error("endDate cannot be on or before startDate");
      }
      return true;
    }),
  handleValidationErrors
];

const fetchUserBookings = async (req, res, next) => {
  const allSpots = await Spot.findAll({});
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
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'description'],
      },
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

router.put("/:bookingId", requireAuth, validDates, async (req, res) => {
  const { bookingId } = req.params;
  const { startDate, endDate } = req.body;
  const currentUser = req.user.id;

const booking = await Booking.findByPk(bookingId);
  if (!booking) {
    return res.status(404).json({ message: "Booking couldn't be found" });
  }

  if (booking.userId !== currentUser) {
    return res.status(403).json({ message: "You are not authorized." });
  }

const currentDate = new Date();
const pastStartDate = new Date(booking.startDate);
if (currentDate > pastStartDate) {
  return res.status(403).json({ message: "Bookings that have been started can't be modified" });
}

  const existingBooking = await Booking.findOne({
    where: {
      spotId: booking.spotId,
      id: {
        [Op.not]: booking.id,
      },
      [Op.or]: [
        {
          startDate: {
            [Op.between]: [startDate, endDate],
          },
        },
        {
          endDate: {
            [Op.between]: [startDate, endDate],
          },
        },
      ],
    },
  });
  if (existingBooking) {
    return res.status(403).json({
      "message": "Sorry, this spot is already booked for the specified dates",
      "errors": {
        "startDate": "Start date conflicts with an existing booking",
        "endDate": "End date conflicts with an existing booking"
      }
    });
  }

  booking.startDate = startDate;
  booking.endDate = endDate;
  booking.updatedAt = new Date();

  await booking.save();
  res.status(200).json(booking);
});

router.delete("/:bookingId", requireAuth, async (req, res) => {
  const { bookingId } = req.params;
  const currentUser = req.user.id;

  const booked = await Booking.findByPk(bookingId);
  if (!booked) {
    return res.status(404).json({ message: "Booking couldn't be found" });
  };

	const spot = await booked.getSpot();

	if (!spot) {
		return res.status(404).json({ message: "Spot couldn't be found" });
	}

	if (booked.userId !== currentUser && spot.ownerId !== currentUser) {
    return res.status(403).json({ message: "You are not authorized."});
}

const currentDate = new Date();
const pastStartDate = new Date(booked.startDate);
if (currentDate > pastStartDate) {
  return res.status(403).json({ message: "Bookings that have been started can't be deleted" });
}

await booked.destroy();
res.status(200).json({ message: "Successfully deleted" });
});

module.exports = router;
