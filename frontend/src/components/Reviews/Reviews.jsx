import { useEffect } from "react";

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

	return (
		<>
			{reviews !== null ? (
				<div className="reviews">
					<h3>Reviews</h3>
					<p className="star-rating">
							<i className="fas fa-star"></i>
							{!spot.numReviews ? "New" : spot.avgStarRating.toFixed(1)}

							{spot.numReviews === 0
								? ""
								: spot.numReviews ===  1
								? `·${spot.numReviews} Review`
								: `·${spot.numReviews} Reviews`}
						</p>
					{user &&
					reviews.every((review) => review.userId !== user.id) &&
					user.id !== spot.ownerId ? (
						<OpenModalButton
							buttonText="Write Your Review"
							modalComponent={<CreateReviewModal spot={spot} />}
						/>
					) : null}

					<ul className="review-list">
						{reviews.length === 0 &&
						user !== null &&
						user.id !== spot.ownerId ? (
							<p>be the first to review!</p>
						) : (
							reviews.map((review) => {

								return (
									<>
										<li  key={review.id}>
											{`${review.User.firstName}
								${review.User.lastName}:
								 ${review.review}
                      ${monthNames[review.createdAtDate.getMonth()]}
                      ${review.createdAtDate.getFullYear()}`}
										</li>
										{user && user.id === review.userId ? (
											<OpenModalButton
												buttonText="Delete Review"

												modalComponent={
													<DeleteReviewModal reviewId={review.id}  spotId={spot.id}/>
												}
											/>
										) : null}
									</>
								);
							})
						)}
					</ul>
				</div>
			) : (
				<h1>Reviews not found</h1>
			)}
		</>
	);
}

export default Reviews;
