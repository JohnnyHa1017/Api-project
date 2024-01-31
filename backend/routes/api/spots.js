const express = require('express');
const { Sequelize } = require('sequelize');
const { Op } = require('sequelize');
const { requireAuth } = require("../../utils/auth");
const { Spot, Review, User, SpotImage, ReviewImage, Booking } = require('../../db/models');
const router = express.Router();

const fetchSpots = async (req, res, next) => {
  const allSpots = await Spot.findAll();
  const detailedSpot = await Promise.all(allSpots.map(async (spot) => {
  const avgRating = await Review.findOne({
    where: {
      spotId: spot.id,
    },
    attributes: [
      [Sequelize.fn("AVG", Sequelize.col("stars")), "avg"],
    ],
  });

  const previewImages = await SpotImage.findAll({
    where: {
      spotId: spot.id,
    },
      attributes: ["url"],
    });

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
      description: spot.description,
      price: spot.price,
      createdAt: spot.createdAt,
      updatedAt: spot.updatedAt,
      avgRating: avgRating.dataValues.avg,
      previewImages: previewImages.find(image => image.url),
    };
  }));
  next();
  req.detailedSpot = detailedSpot;
};

router.get('/', fetchSpots, (req, res) => {
  const { detailedSpot } = req;
  res.status(200).json({ Spots: detailedSpot });
});

router.get('/current', fetchSpots, (req, res) => {
  const { detailedSpot } = req;
  res.status(200).json({ OtherSpots: detailedSpot });
});

module.exports = router;
