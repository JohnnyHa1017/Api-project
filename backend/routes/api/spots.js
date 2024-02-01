const express = require('express');
const { Sequelize } = require('sequelize');
const { Op } = require('sequelize');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, Review, User, SpotImage, ReviewImage, Booking } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

const fetchSpots = async (req, res, next) => {
  const allSpots = await Spot.findAll();
  const detailedSpot = await Promise.all(allSpots.map(async (spot) => {

    const reviewsLength = await Review.count({
      where: {
        spotId: spot.id,
      },
    });

    const starsColumn = await Review.sum("stars", {
      where: {
        spotId: spot.id,
      },
    });

    let avgRating;

    if (starsColumn === null) avgRating = 0;
    else avgRating = (starsColumn / reviewsLength).toFixed(1);

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
      description: spot.description,
      price: spot.price,
      createdAt: spot.createdAt,
      updatedAt: spot.updatedAt,
      avgRating: avgRating,
      previewImages: imageSearch
    };
  }));
  req.detailedSpot = detailedSpot;
  next();
};

const validateSpots = [
  check('address')
    .isString()
    .exists({ checkFalsy: true })
    .withMessage("Street address is required"),
  check('city')
    .isString()
    .exists({ checkFalsy: true })
    .withMessage("City is required"),
  check('state')
    .isString()
    .exists({ checkFalsy: true })
    .withMessage("State is required"),
  check('country')
    .isString()
    .exists({ checkFalsy: true })
    .withMessage("Country is required"),
  check('lat')
    .isDecimal()
    .exists({ checkFalsy: true })
    .withMessage("Latitude must be within -90 and 90")
    .isFloat({ min: -90, max: 90 }),
  check('lng')
    .isDecimal()
    .exists({ checkFalsy: true })
    .withMessage("Longitude must be within -180 and 180")
    .isFloat({ min: -180, max: 180 }),
  check('name')
    .isString()
    .exists({ checkFalsy: true })
    .withMessage("Name must be less than 50 characters"),
  check('description')
    .isString()
    .exists({ checkFalsy: true })
    .withMessage("Description is required"),
  check('price')
    .isDecimal()
    .exists({ checkFalsy: true })
    .withMessage("Price per day must be a positive number")
    .isFloat({ min: 0 }),
  handleValidationErrors
];

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
        avgStarRating: spotById.avgRating,
        SpotImages: relatedImages,
        Owner: relatedOwner,
      }
  return res.status(200).json(response);
});

router.post('/', requireAuth, validateSpots, async (req, res) => {
try{
  const userId = req.user.id;
    const {
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
    } = req.body;

    const newValidSpot = await Spot.create({
      ...req.body,
      ownerId: userId,
    });

  return res.status(201).json(newValidSpot);
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

router.post("/:spotId/images", requireAuth, async (req, res) => {
  const { spotId } = req.params;
  const { url, preview } = req.body;
  const currentUser = req.user.id;

  const spot = await Spot.findByPk(spotId);
  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  };
  if(spot.ownerId !== currentUser){
    return res.status(403).json({ message: "You are not authorized."});
};

const newSpotImage = await SpotImage.create({ spotId, url, preview });

const updatedSpotImage = await SpotImage.findAll({
  where: {
    url: url,
  },
  attributes: {
    exclude: ["createdAt", "updatedAt"],
  },
});

res.json(updatedSpotImage);
});

router.put("/:spotId", requireAuth, validateSpots, async (req, res) => {
  const { spotId } = req.params;
  const currentUser = req.user.id;
try {
  const spot = await Spot.findByPk(spotId);
  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  };
  if(spot.ownerId !== currentUser){
    return res.status(403).json({ message: "You are not authorized."});
};
  await spot.update(req.body);

  const updatedSpot = await Spot.findByPk(spotId);

  return res.status(200).json(updatedSpot);
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

router.delete("/:spotId", requireAuth, async (req, res) => {
  const { spotId } = req.params;
  const currentUser = req.user.id;

  const spot = await Spot.findByPk(spotId);
  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  };
  if(spot.ownerId !== currentUser){
    return res.status(403).json({ message: "You are not authorized."});
};
await spot.destroy();

return res.status(200).json({ message: "Successfully deleted" });
});

module.exports = router;
