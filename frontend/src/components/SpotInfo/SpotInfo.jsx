import { useParams } from "react-router-dom";
import { useEffect } from "react";
import Reviews from "../Reviews/Reviews";
import { fetchSpot } from "../../store/spots";
import "./SpotInfo.css";
import { useDispatch, useSelector } from "react-redux";

function SpotLocation({ spot }) {
  return (
    <div className="spot-info">
      <h3 className="spot-location">{`${spot.city}, ${spot.state}`}</h3>
    </div>
  );
}

function SpotInfo() {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const spot = useSelector((state) => state.spots.spots).find((x) => x.id === spotId);

  useEffect(() => {
    dispatch(fetchSpot(spotId));
  }, [spotId, dispatch]);

  return spot ? (
    <div className="spot-body">
      <h1>{spot.name}</h1>
      <SpotLocation spot={spot} />

      <div className="large-box">
        <div className="large-picture">
          {spot.SpotImages?.length >= 1 && (
            <img
              src={spot.SpotImages.find((image) => image.preview === true).url}
              alt={spot.name}
              className="spot-image-large"
            />
          )}
        </div>
        <div className="small-pictures">
          {spot.SpotImages?.length > 1 && (
            <ul className="image-list">
              {spot.SpotImages.filter((image) => image.preview === false).map((image) => (
                <li key={image.id}>
                  <img src={image.url} alt={spot.name} className="spot-image-small" />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="positioner">
        <div className="host-and-desc">
          <h3>
            Hosted by {spot.Owner?.firstName} {spot.Owner?.lastName}
          </h3>
          <p>{spot.description}</p>
        </div>
        <div className="right-box">
          <div className="rating-price">
            <p className="star-rating">
              <i className="fas fa-star"></i>
              {!spot.numReviews ? "New" : spot.avgStarRating.toFixed(1)}
              {spot.numReviews === 0
                ? ""
                : spot.numReviews === 1
                ? `·${spot.numReviews} Review`
                : `·${spot.numReviews} Reviews`}
            </p>
            <p className="spot-price-single">{`$${spot.price} / night`}</p>
          </div>
          <button
            className="reserve"
            onClick={() => alert("Reservation feature is currently under development. Please check back later.")}
          >
            Reserve
          </button>
        </div>
      </div>

      <Reviews spot={spot} />
    </div>
  ) : (
    <div>Loading</div>
  );
}

export default SpotInfo;

