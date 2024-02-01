const express = require("express");
const { Sequelize } = require("sequelize");
const { Op } = require("sequelize");
const { requireAuth } = require("../../utils/auth");
const { Spot, Review, User, SpotImage, ReviewImage, Booking } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

const fetchUserReviews = async (req, res, next) => {
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
  }))

  const userReviews = await Review.findAll({
    where: {
      userId: req.user.id
    },
    include: [
      {
        model: User,
        attributes: ['id', 'firstName', 'lastName']
      },
      {
        model: Spot,
        detailedSpot
      },
      {
        model: ReviewImage,
        attributes: ['id', 'url']
      }
    ]
  });

  req.userReviews = userReviews;
  next();
}

const countAttachedImages = async (req, res, next) => {
  const { reviewId } = req.params;

  const imageCount = await ReviewImage.count({
    where: { reviewId },
  });

  if (imageCount >= 10) {
    return res.status(403).json({ message: 'Maximum number of images for this resource was reached' });
  }
  next();
};

router.get('/current', requireAuth, fetchUserReviews, async (req, res) => {
  const { userReviews } = req;
  const currentUser = req.user.id;

  const unauthorizedReview = userReviews.find(review => review.userId !== currentUser);
    if (unauthorizedReview) {
      return res.status(403).json({ message: "You are not authorized." });
    };

  res.status(200).json({ Reviews: userReviews });
});

router.post('/:reviewId/images', requireAuth, countAttachedImages, async (req, res) => {
  const { reviewId } = req.params;
  const { url } = req.body;
  const currentUser = req.user.id;

  const reviewAuth = await Review.findByPk(reviewId);
  if (!reviewAuth) {
    return res.status(404).json({ message: "Review couldn't be found" });
  };
  if(reviewAuth.userId !== currentUser){
    return res.status(403).json({ message: "You are not authorized."});
};

  const newImage = await ReviewImage.create({
    reviewId,
    url,
  });

  const newImageAttached = await ReviewImage.findAll({
    where: {
      url: url,
    },
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
  });

  res.status(200).json(newImageAttached);
});

module.exports = router;
