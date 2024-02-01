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

	const reviewImage = await ReviewImage.findByPk(imageId);
	if (!reviewImage) {
		return res.status(404).json({ message: "Review Image couldn't be found" });
	}

	const review = await Review.findByPk(reviewImage.reviewId);

	if (!review || review.userId !== currentUser) {
		return res.status(403).json({ message: "You are not authorized to delete this review image" });
	}

	await reviewImage.destroy();
	res.status(200).json({ message: "Successfully deleted" });
});

module.exports = router;
