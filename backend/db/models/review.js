'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
			Review.belongsTo(models.Spot, {
				foreignKey: "spotId",
			});
			Review.belongsTo(models.User, {
				foreignKey: "userId",
			});
			Review.hasMany(models.ReviewImage, {
				foreignKey: "reviewId",
				onDelete: "CASCADE",
				hooks: true,
			});
    }
  }
  Review.init({
    userId: {
      type: DataTypes.INTEGER,
      references: { model: "User", key: "id" },
      onDelete: 'CASCADE'
    },
    spotId: {
      type: DataTypes.INTEGER,
      references: { model: "Spot", key: "id" },
      onDelete: 'CASCADE'
    },
    review: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Review text is required',
        }
      }
    },
    stars: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        isNumeric: {
          msg: 'Stars must be an integer from 1 to 5',
        },
        customValidation(value) {
          if (value < 1 || value > 5) {
            throw new Error('Stars must be an integer from 1 to 5');
          }
        },
      },
    },

  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};
