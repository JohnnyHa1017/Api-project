const express = require("express");
const { Sequelize } = require("sequelize");
const { Op } = require("sequelize");
const { requireAuth } = require("../../utils/auth");
const { Spot, Review, User, SpotImage, ReviewImage, Booking } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

router.delete("/:imageId", requireAuth, async (req, res) => {
	const { imageId } = req.params;
	const currentUser = req.user.id;

	const spotImage = await SpotImage.findByPk(imageId);
	if (!spotImage) {
		return res.status(404).json({ message: "Spot Image couldn't be found" });
	}
	const spot = await Spot.findByPk(spotImage.spotId);

	if (!spot || spot.ownerId !== currentUser) {
		return res.status(403).json({ message: "You are not authorized."});
	}
	await spotImage.destroy();

	res.status(200).json({ message: "Successfully deleted" });
});

module.exports = router;
