import { csrfFetch } from "./csrf";
import { fetchSpot } from "./spots";

const GET_REVIEWS = "reviews/getReviews";
const getReview = (reviews) => ({
	type: GET_REVIEWS,
	payload: reviews,
});

export const getReviews = (spotId) => async (dispatch) => {
	try {
		const response = await fetch(`/api/spots/${spotId}/reviews`, {
			method: "GET",
		});
		const data = await response.json();
		if (data) {
			dispatch(
				getReview(
					data.Reviews.map((review) => {
						return {
							...review,
							createdAtDate: new Date(review.createdAt)
						};
					}).sort((review1, review2) => {
						const firstDate = new Date(review1.createdAt);
						const secondDate = new Date(review2.createdAt);
						return secondDate - firstDate;
					})
					));
				}
			} catch (error) {
				console.error("Failed to fetch reviews");
			}
		};

		export const createReview = (reviews) => async (dispatch) => {
			const { review, stars, spotId } = reviews;
			const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
				method: "POST",
				body: JSON.stringify({
					review,
					stars,
				}),
			});

			const data = await response.json();
			dispatch(getReviews(spotId));
			dispatch(fetchSpot(spotId));

			return data;
		};

		const DELETE_REVIEWS = "reviews/deleteReview";
		const deleteReview = (reviewId) => ({
			type: DELETE_REVIEWS,
			reviewId: reviewId,
		});

		export const deleteUserReview = (reviewId,spotId) => async (dispatch) => {
			try {
				const response = await csrfFetch(`/api/reviews/${reviewId}`, {
					method: "DELETE",
				});
				const data = await response.json();
				if (data) {
					dispatch(deleteReview(reviewId));
					dispatch(fetchSpot(spotId))
				}
			} catch (error) {
				console.error("Failed to fetch reviews:", error);
			}
		};

		const initialState = { reviews: [] };

		function reviewReducer(state = initialState, action) {
			switch (action.type) {
		case GET_REVIEWS:
			return { ...state, reviews: action.payload };
		case DELETE_REVIEWS:
			return {
				...state,
				reviews: state.reviews.filter((review) =>
					review.id === action.reviewId ? false : true
				),
			};
		default:
			return state;
	}
}

export default reviewReducer;
