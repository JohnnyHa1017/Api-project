import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import OpenModalButton from "../OpenModalButton";
import CreateReviewModal from "./CreateReviewModal";
import { getReviews } from "../../store/review";
import DeleteReviewModal from "./DeleteReviewModal";
import "./Reviews.css"

function Reviews({ spot }) {
	const dispatch = useDispatch();

	const user = useSelector((state) => {
		return state.session.user;
	});

	const monthNames = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];

	const reviews = useSelector((state) => {
  return state.reviews.reviews;
	});

	useEffect(() => {
		dispatch(getReviews(spot.id));
	}, [spot.id, dispatch]);

	const avgStarRatingAsNumber = parseFloat(spot.avgStarRating);

  return (
    <div className="reviews">
      <h3>Reviews</h3>
      <p className="star-rating">
        <i className="fas fa-star"></i>
        {reviews.length > 0
          ? (
            <>
              {spot.numReviews === 0 ? "New" : avgStarRatingAsNumber.toFixed(1)}
              {spot.numReviews === 0
                ? ""
                : spot.numReviews === 1
                  ? `·${spot.numReviews} Review`
                  : `·${spot.numReviews} Reviews`}
            </>
          )
          : "No reviews have been made yet 😔"}
        {reviews.length === 0 && (
          <>
            {(user === null || user.id !== spot.ownerId) && (
              <div className="common-review-button">
                <p>Be the first to post a review!</p>
                {user && (
                  <OpenModalButton
                    buttonText="Write Your Review"
                    modalComponent={<CreateReviewModal spot={spot} />}
                  />
                )}
              </div>
            )}
            {(user === null || user.id === spot.ownerId) && (
              <>
                <h1>This spot is still too new!</h1>
              </>
            )}
          </>
        )}
      </p>
      {reviews.length > 0 && (
        <>
          {user &&
          reviews.every((review) => review.userId !== user.id) &&
          user.id !== spot.ownerId ? (
            <OpenModalButton
              buttonText="Write Your Review"
              modalComponent={<CreateReviewModal spot={spot} />}
              className="common-review-button"
            />
          ) : null}
          <ul className="review-list">
            {reviews.map((review) => (
              <React.Fragment key={review.id}>
                <li>
                  {`${review.User.firstName} ${review.User.lastName}:
                  ${review.review}
                  ${monthNames[review.createdAtDate.getMonth()]}
                  ${review.createdAtDate.getFullYear()}`}
                </li>
                {user && user.id === review.userId ? (
                  <OpenModalButton
                    buttonText="Delete Review"
                    modalComponent={
                      <DeleteReviewModal reviewId={review.id} spotId={spot.id} />
                    }
                    className="common-review-button"
                  />
                ) : null}
              </React.Fragment>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default Reviews;
