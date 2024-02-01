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
      previewImages: previewImages.find(image => image.url).dataValues.url,
    };
  }));
  req.detailedSpot = detailedSpot;
  next();
};

router.get('/', fetchSpots, (req, res) => {
  const { detailedSpot } = req;
  res.status(200).json({ Spots: detailedSpot });
});

router.get('/current', requireAuth, fetchSpots, async (req, res) => {
  const { detailedSpot } = req;
  const userCurrent = req.user.id;
    const ownerCurrent = await Spot.findAll({
      where: {
        ownerId: userCurrent,
      },
    });
    const userSpots = detailedSpot.filter(spot => spot.ownerId === userCurrent);
  res.status(200).json({ Spots: userSpots });
});

router.get('/:spotId', fetchSpots, async (req, res) => {
  const { spotId } = req.params;
  const { detailedSpot } = req;

    const spotById = detailedSpot.find((spot) => spot.id == spotId);

    if (!spotById) {
      return res.status(404).json({ error: 'Spot not found' });
    }

    const relatedReviews = await Review.findAll({
      where: {
        spotId: spotById.id,
      }
    });

    const relatedImages = await SpotImage.findAll({
      where: {
        spotId: spotById.id,
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
    });

    const relatedOwner = await User.findByPk(spotById.ownerId, {
      attributes: ['id', 'firstName', 'lastName'],
    });

  const response = {
        id: spotById.id,
        ownerId: spotById.ownerId,
        address: spotById.address,
        city: spotById.city,
        state: spotById.state,
        country: spotById.country,
        lat: spotById.lat,
        lng: spotById.lng,
        name: spotById.name,
        description: spotById.description,
        price: spotById.price,
        createdAt: spotById.createdAt,
        updatedAt: spotById.updatedAt,
        numReviews: relatedReviews.length,
        avgRating: spotById.avgRating,
        SpotImages: relatedImages,
        Owner: relatedOwner,
      }
  return res.status(200).json(response);
});

module.exports = router;
