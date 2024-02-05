const express = require("express");
const { Sequelize } = require("sequelize");
const { Op } = require("sequelize");
const { requireAuth } = require("../../utils/auth");
const { Spot, Review, User, SpotImage, ReviewImage, Booking } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

const validateReview = [
  check('review')
    .isString()
    .exists({ checkFalsy: true })
    .withMessage('Review text is required'),
  check('stars')
    .isInt({ min: 1, max: 5 })
    .withMessage('Stars must be an integer from 1 to 5'),
  handleValidationErrors,
];

const fetchUserReviews = async (req, res, next) => {
  const allSpots = await Spot.findAll({
    attributes: {
      exclude: ['createdAt', 'updatedAt', 'description']
    }
  });
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

    const sanitizedReviews = userReviews.map(review => {
      const { createdAt, updatedAt, ...reviewDetails } = review;
      return reviewDetails;
    });

    res.status(200).json({ Reviews: sanitizedReviews });
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
      exclude: ["reviewId", "createdAt", "updatedAt"],
    },
  });

  res.status(200).json(newImageAttached);
});

router.put('/:reviewId', requireAuth, validateReview, async (req, res) => {
  const { reviewId } = req.params;
  const { review, stars } = req.body;
  const currentUser = req.user.id;
try {
  const reviews = await Review.findByPk(reviewId);
  if (!reviews) {
    return res.status(404).json({ message: "Review couldn't be found" });
  };
  if(reviews.userId !== currentUser){
    return res.status(403).json({ message: "You are not authorized."});
};
  await reviews.update(req.body);

  const updatedReview = await Review.findByPk(reviewId);

  return res.status(200).json(updatedReview);
  } catch (error) {
    if (error instanceof Sequelize.ValidationError) {
      const validationErrors = handleValidationErrors(error.errors);
      return res.status(400).json({
        message: 'Bad Request',
        errors: validationErrors,
      });
    }
  }
});

router.delete("/:reviewId", requireAuth, async (req, res) => {
  const { reviewId } = req.params;
  const currentUser = req.user.id;

  const reviews = await Review.findByPk(reviewId);
  if (!reviews) {
    return res.status(404).json({ message: "Review couldn't be found" });
  };
  if(reviews.userId !== currentUser){
    return res.status(403).json({ message: "You are not authorized."});
};
await reviews.destroy();

return res.status(200).json({ message: "Successfully deleted" });
});

module.exports = router;
